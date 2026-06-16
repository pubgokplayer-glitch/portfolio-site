import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://btagpazigndpaccjqujl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0YWdwYXppZ25kcGFjY2pxdWpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0MzQ5ODgsImV4cCI6MjA5NzAxMDk4OH0.G_Yhk1bMIWGKHjpbCSmFkM7DYUy3zbjBOhAHVPaTbHQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
