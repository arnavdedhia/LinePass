insert into public.venues (slug, name, address, image_url, logo_url, hours_label)
values
  ('kams', 'KAMS', '102 E Green St, Champaign', '/kams-venue.jpg', '/kams-venue.jpg', 'Open until 2:00 AM'),
  ('red-lion', 'Red Lion', '211 E Green St, Champaign', '/red-lion-venue.jpg', '/red-lion-logo.jpg', 'Open until 2:00 AM')
on conflict (slug) do update set
  name = excluded.name,
  address = excluded.address,
  image_url = excluded.image_url,
  logo_url = excluded.logo_url,
  hours_label = excluded.hours_label;

insert into public.cover_options (venue_id, weekday, title, price_cents)
select venues.id, options.weekday, options.title, options.price_cents
from (
  values
    ('kams', 1, 'Cover (Mon, All Day)', 1000),
    ('kams', 2, 'Cover (Tues, w/TimeWarp Punch Card)', 1000),
    ('red-lion', 1, 'Cover (Mon, All Day)', 1000),
    ('red-lion', 2, 'Cover (Tues, All Day)', 1000)
) as options (slug, weekday, title, price_cents)
join public.venues on venues.slug = options.slug
on conflict (venue_id, weekday) do update set
  title = excluded.title,
  price_cents = excluded.price_cents;
