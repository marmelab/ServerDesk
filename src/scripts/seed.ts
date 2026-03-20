import { faker } from '@faker-js/faker';
import * as dotenvFlow from 'dotenv-flow';
import { createClient } from '@supabase/supabase-js';
import { Database } from 'supabase/types';
import { AppUserRole, TicketInsert } from '@/types';

// Charge automatiquement .env, .env.local, .env.{NODE_ENV}, .env.{NODE_ENV}.local
dotenvFlow.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SECRET_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Error supabase keys');
  process.exit(1);
}

const supabase = createClient<Database>(SUPABASE_URL, SERVICE_ROLE_KEY, {
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

  const NB_USER: number = 15;
  // Customer managers and companies
  for (let i = 0; i < NB_USER; i++) {
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
      },
    });

    if (error) console.error('❌ Error:', error.message);

    if (userData && userData.user && userData.user.id && companyData) {
      // Give role and company
      const isAgent: boolean = i < NB_USER / 2;
      const appRole: AppUserRole = isAgent ? 'agent' : 'customer_manager';
      const { error: updateError } = await supabase
        .from('app_user')
        .update({ role: appRole })
        .eq('id', userData.user.id);
      if (updateError) console.error(updateError);

      const customerId = isAgent ? null : userData.user.id;
      if (!isAgent) {
        const { error: insertCompanyError } = await supabase
          .from('user_companies')
          .insert({ user_id: userData.user.id, company_id: companyData.id });
        if (insertCompanyError) console.error(insertCompanyError);
      }

      for (let i = 0; i < 5; i++) {
        const newTicket: TicketInsert = {
          subject: faker.hacker.phrase(),
          description: faker.lorem.paragraph(),
          company_id: companyData?.id as number,
          customer_id: customerId,
        };

        const { error } = await supabase.from('tickets').insert(newTicket);
        if (error) console.error('❌ Error:', error.message);
      }
    }
  }
}

runSeed().catch(console.error);
