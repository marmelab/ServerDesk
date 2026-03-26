import { faker } from '@faker-js/faker';
import * as dotenvFlow from 'dotenv-flow';
import { createClient } from '@supabase/supabase-js';
import { Database } from 'supabase/types';
import { MessageInsert, TicketInsert } from '@/types';

const NB_COMPANIES: number = 15;
const NB_TICKETS: number = 15;
const NB_MESSAGES: number = 5;

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

  // Customer managers and companies
  for (let i = 0; i < NB_COMPANIES; i++) {
    const companyName = faker.company.name();
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .insert({ name: companyName })
      .select()
      .single();
    if (companyError) console.error(companyError);

    const { data: agentData, error: agentError } =
      await supabase.auth.admin.createUser({
        email: `agent${i}@test.com`,
        password: '123456',
        email_confirm: true,
        user_metadata: {
          name: faker.person.fullName(),
          role: 'agent',
        },
      });
    if (agentError) console.error('❌ Error:', agentError.message);

    const { data: userData, error: userError } =
      await supabase.auth.admin.createUser({
        email: `test${i}@test.com`,
        password: '123456',
        email_confirm: true,
        user_metadata: {
          name: faker.person.fullName(),
          role: 'customer_manager',
        },
      });

    if (userError) console.error('❌ Error:', userError.message);

    if (agentData?.user?.id && userData?.user?.id && companyData) {
      // Update role because of trigger
      const { error: updateError } = await supabase
        .from('app_user')
        .update({ role: 'customer_manager' })
        .eq('id', userData.user?.id);
      if (updateError) console.error(updateError);

      // Give company
      const rowsToInsert = [
        { user_id: userData.user.id, company_id: companyData.id },
      ];

      // For e2e tests, we don't assign company to first agent
      if (i !== 0) {
        rowsToInsert.push({
          user_id: agentData.user.id,
          company_id: companyData.id,
        });
      }
      const { error: insertCompanyError } = await supabase
        .from('user_companies')
        .insert(rowsToInsert);

      if (insertCompanyError) console.error(insertCompanyError);

      // Create tickets
      for (let i = 0; i < NB_TICKETS; i++) {
        const newTicket: TicketInsert = {
          subject: faker.hacker.phrase(),
          description: faker.lorem.paragraph(),
          company_id: companyData?.id as number,
          customer_id: userData.user.id,
          contact_id: null,
        };

        const { data: ticketData, error } = await supabase
          .from('tickets')
          .insert(newTicket)
          .select()
          .single();
        if (error) console.error('❌ Error:', error.message);

        if (!ticketData?.id) return;

        // Create messages
        for (let i = 0; i < NB_MESSAGES; i++) {
          const newMessage: MessageInsert = {
            text: faker.lorem.sentences(),
            ticket_id: ticketData?.id,
            sender_id: i % 2 === 0 ? userData.user.id : agentData.user.id,
          };
          const { error } = await supabase.from('messages').insert(newMessage);
          if (error) console.error('❌ Error:', error.message);
        }
      }
    }
  }
}

runSeed().catch(console.error);
