'use server';

import { dbAdmin } from "@/src/index"; // Your Drizzle admin instance
import { eq,getTableColumns,and } from "drizzle-orm";
import { PgTable, TableConfig } from "drizzle-orm/pg-core";
import { InferInsertModel } from "drizzle-orm";

export async function getAllRows<T extends PgTable<TableConfig>>(table: T) { 
  try {
    // By using PgTableWithColumns, Drizzle is guaranteed 
    // that the table has a valid selection set.
    const result = await dbAdmin.select().from(table as any);
    return result; 
  } catch (error) {
    console.error("Error fetching rows:", error);
    throw error; // Usually better to throw in a library function
  }
}

// Add a language
export async function addRow<T extends PgTable<TableConfig>>(
  table: T, 
  values: InferInsertModel<T>
) {
  try {
    
    await dbAdmin.insert(table).values(values);
    return true;
  } catch (error) {
    console.error("Error inserting row:", error);
    return false;
  }
}

// Delete a language by ID
export async function deleteRow<T extends PgTable>(table: T,criteria: Record<string, any>) {
  try {
    console.log("Deleting from table:", table._.name);

    
    const columns = getTableColumns(table);
    // 1. Map the object keys to Drizzle equality expressions
    const filters = Object.entries(criteria).map(([key, value]) => {
    const column = columns[key];
      if (!column) {
        throw new Error(`Column "${key}" does not exist on table "${table._.name}"`);
      }
      return eq(column, value);
    });

    await dbAdmin.delete(table).where(and(...filters));
    return true;
  } catch (error) {
    console.error(`Error deleting from ${table._.name}:`, error);
    return false;
  }
}

export async function searchItem<T extends PgTable>(table: T, criteria: Record<string, any>) {

  try {

    const columns = getTableColumns(table);
    // 1. Map the object keys to Drizzle equality expressions
    const filters = Object.entries(criteria).map(([key, value]) => {
    const column = columns[key];
      if (!column) {
        throw new Error(`Column "${key}" does not exist on table "${table._.name}"`);
      }
      return eq(column, value);
    });

    // 2. Combine all filters with 'and'
    const result = await dbAdmin
      .select()
      .from(table as any)
      .where(and(...filters)); // Use the spread operator to pass the array

    return result.length > 0;
  } catch (error) {
    console.error(`Search error in ${table._.name}:`, error);
    return false;
  }
}

