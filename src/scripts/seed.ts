import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SECRET_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Error supabase keys');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function runSeed() {
  // Clear users
  const {
    data: { users },
    error: listError,
  } = await supabase.auth.admin.listUsers();
  if (listError) throw listError;

  if (users.length > 0) {
    await Promise.all(
      users.map((user) => supabase.auth.admin.deleteUser(user.id)),
    );
  }

  // Clear companies
  const { error: clearCompanies } = await supabase
    .from('companies')
    .delete()
    .gt('id', 0);

  if (clearCompanies) {
    console.error('Error destroying comapanies', clearCompanies.message);
  }

  // Clear tickets
  const { error: clearTickets } = await supabase
    .from('tickets')
    .delete()
    .gt('id', 0);

  if (clearTickets) {
    console.error('Error destroying tickets', clearTickets.message);
  }

  // Create users
  // Admin
  const { error } = await supabase.auth.admin.createUser({
    email: 'jerome@marmelab.com',
    password: '123456',
    email_confirm: true,
    user_metadata: {
      name: 'Jerome',
    },
  });

  if (error) console.error('❌ Error:', error.message);

  // Customer managers and companies
  for (let i = 0; i < 5; i++) {
    const companyName = faker.company.name();
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .insert({ name: companyName })
      .select()
      .single();
    if (companyError) console.error(companyError);

    const { data: userData, error } = await supabase.auth.admin.createUser({
      email: `test${i}@test.com`,
      password: '123456',
      email_confirm: true,
      user_metadata: {
        name: faker.person.fullName(),
        company_id: companyData?.id,
      },
    });

    if (error) console.error('❌ Error:', error.message);

    for (let i = 0; i < 5; i++) {
      const { error } = await supabase.from('tickets').insert({
        subject: faker.hacker.phrase(),
        description: faker.lorem.paragraph(),
        company_id: companyData?.company_id,
        customer_id: userData.user?.id,
      });
      if (error) console.error('❌ Error:', error.message);
    }
  }
}

runSeed().catch(console.error);
