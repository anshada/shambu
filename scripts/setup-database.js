const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  try {
    console.log('Setting up database...');

    // Enable extensions
    await supabase.rpc('setup_extensions', {
      extensions: ['uuid-ossp', 'vector', 'pg_trgm']
    });

    // Create tables
    const schemaSQL = fs.readFileSync(
      path.join(__dirname, '../database/schema.sql'),
      'utf8'
    );
    await supabase.rpc('run_sql', { sql: schemaSQL });

    // Create functions
    const functionsDir = path.join(__dirname, '../database/functions');
    const functionFiles = fs.readdirSync(functionsDir);
    
    for (const file of functionFiles) {
      if (file.endsWith('.sql')) {
        const functionSQL = fs.readFileSync(
          path.join(functionsDir, file),
          'utf8'
        );
        await supabase.rpc('run_sql', { sql: functionSQL });
      }
    }

    // Setup RLS policies
    const policiesSQL = fs.readFileSync(
      path.join(__dirname, '../database/policies.sql'),
      'utf8'
    );
    await supabase.rpc('run_sql', { sql: policiesSQL });

    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase(); 