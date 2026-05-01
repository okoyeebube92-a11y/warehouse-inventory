import supabase from '../config/supabase.js'

export const createEntries = async (entries) => {
  const { data, error } = await supabase
    .from('stock_entries')
    .insert(entries)
    .select()

  if (error) {
    throw error
  }

  return data
}