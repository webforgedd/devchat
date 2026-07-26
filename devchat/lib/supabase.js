import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://tajgrnhevnbniuepftkj.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhamdybmhldm5ibml1ZXBmdGtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NzAzNDIsImV4cCI6MjA5NDM0NjM0Mn0.iQJIL8lXVm-D-DBphdzjvMiOme4fZulwhI2jCV0hAaA"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)