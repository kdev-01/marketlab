-- Fictional Yes/No markets for workshop demos (fake money only).
insert into public.markets (title, description, status, close_date)
values
  (
    'Will the demo deploy before lunch?',
    'A workshop smoke-test market. Bet fake money on whether we ship the first feature slice on time.',
    'open',
    now() + interval '7 days'
  ),
  (
    'Will it rain in Quito this weekend?',
    'Weather markets are classic prediction fodder. No real forecasts were harmed in making this market.',
    'open',
    now() + interval '3 days'
  ),
  (
    'Did the mascot costume arrive on time?',
    'Event logistics market. Closed for new bets; awaiting resolution.',
    'closed',
    now() - interval '1 day'
  ),
  (
    'Was the opening keynote over 30 minutes?',
    'Resolved market from a past session. Payouts are imaginary.',
    'resolved',
    now() - interval '14 days'
  ),
  (
    'Will someone ask about RLS before hour two?',
    'Security curiosity index for the room. Still open for fun.',
    'open',
    now() + interval '10 days'
  );
