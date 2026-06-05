-- Public market stats derived from real positions and ledger (no mock data)

create or replace function public.get_market_share_totals(p_market_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_yes bigint;
  v_no bigint;
begin
  select
    coalesce(sum(yes_shares_cents), 0),
    coalesce(sum(no_shares_cents), 0)
  into v_yes, v_no
  from public.positions
  where market_id = p_market_id;

  return jsonb_build_object(
    'yes_shares_cents', v_yes,
    'no_shares_cents', v_no
  );
end;
$$;

create or replace function public.get_market_price_history(p_market_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_yes bigint := 0;
  v_no bigint := 0;
  v_total bigint;
  v_yes_chance int;
  v_result jsonb := '[]'::jsonb;
  r record;
begin
  for r in
    select created_at, entry_type, abs(amount_cents) as buy_cents
    from public.ledger_entries
    where market_id = p_market_id
      and entry_type in ('buy_yes', 'buy_no')
    order by created_at asc
  loop
    if r.entry_type = 'buy_yes' then
      v_yes := v_yes + r.buy_cents;
    else
      v_no := v_no + r.buy_cents;
    end if;

    v_total := v_yes + v_no;
    if v_total = 0 then
      v_yes_chance := 50;
    else
      v_yes_chance := round((v_yes::numeric / v_total) * 100);
    end if;

    v_result := v_result || jsonb_build_array(
      jsonb_build_object(
        'recorded_at', r.created_at,
        'yes_chance', v_yes_chance
      )
    );
  end loop;

  return v_result;
end;
$$;

revoke all on function public.get_market_share_totals(uuid) from public;
revoke all on function public.get_market_price_history(uuid) from public;

grant execute on function public.get_market_share_totals(uuid) to anon, authenticated;
grant execute on function public.get_market_price_history(uuid) to anon, authenticated;
