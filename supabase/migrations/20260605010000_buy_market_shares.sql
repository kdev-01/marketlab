-- Atomic fake-money buy: debit balance, upsert position, ledger entry

create or replace function public.buy_market_shares(
  p_market_id uuid,
  p_side text,
  p_amount_cents bigint
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_market public.markets%rowtype;
  v_balance bigint;
  v_position public.positions%rowtype;
  v_entry_type text;
begin
  if v_user_id is null then
    raise exception 'not_authenticated';
  end if;

  if p_amount_cents is null or p_amount_cents <= 0 then
    raise exception 'invalid_amount';
  end if;

  if p_side not in ('yes', 'no') then
    raise exception 'invalid_side';
  end if;

  select *
  into v_market
  from public.markets
  where id = p_market_id;

  if not found then
    raise exception 'market_not_found';
  end if;

  if v_market.status <> 'open' or v_market.close_date <= now() then
    raise exception 'market_not_buyable';
  end if;

  select balance_cents
  into v_balance
  from public.profiles
  where id = v_user_id
  for update;

  if not found then
    raise exception 'profile_not_found';
  end if;

  if v_balance < p_amount_cents then
    raise exception 'insufficient_balance';
  end if;

  update public.profiles
  set balance_cents = balance_cents - p_amount_cents
  where id = v_user_id;

  insert into public.positions (
    user_id,
    market_id,
    yes_shares_cents,
    no_shares_cents,
    invested_cents
  )
  values (
    v_user_id,
    p_market_id,
    case when p_side = 'yes' then p_amount_cents else 0 end,
    case when p_side = 'no' then p_amount_cents else 0 end,
    p_amount_cents
  )
  on conflict (user_id, market_id) do update
  set
    yes_shares_cents = public.positions.yes_shares_cents
      + case when p_side = 'yes' then p_amount_cents else 0 end,
    no_shares_cents = public.positions.no_shares_cents
      + case when p_side = 'no' then p_amount_cents else 0 end,
    invested_cents = public.positions.invested_cents + p_amount_cents
  returning *
  into v_position;

  v_entry_type := case when p_side = 'yes' then 'buy_yes' else 'buy_no' end;

  insert into public.ledger_entries (
    user_id,
    market_id,
    amount_cents,
    entry_type,
    description
  )
  values (
    v_user_id,
    p_market_id,
    -p_amount_cents,
    v_entry_type,
    'Fake money purchase'
  );

  select balance_cents
  into v_balance
  from public.profiles
  where id = v_user_id;

  return jsonb_build_object(
    'balance_cents', v_balance,
    'yes_shares_cents', v_position.yes_shares_cents,
    'no_shares_cents', v_position.no_shares_cents,
    'invested_cents', v_position.invested_cents
  );
end;
$$;

revoke all on function public.buy_market_shares(uuid, text, bigint) from public;
grant execute on function public.buy_market_shares(uuid, text, bigint) to authenticated;
