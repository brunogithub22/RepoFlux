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
  values: InferInsertModel<T>,
  targetColumn?: any
) {
  try {
    await dbAdmin.insert(table).values(values).onConflictDoNothing({ target: targetColumn });
    return true;
  } catch (error) {
    console.error("Error inserting row:", error);
    return false;
  }
}

export async function modifyRow <T extends PgTable<TableConfig>>(
  table: T, 
  values: any ,
  targetColumn?: any
){
 try{
    await dbAdmin.update(table).set(values)
    return true;
 }catch(error){
    console.error("Error changing row:", error);
    return false;
 }
}

// Delete a language by ID
export async function deleteRow<T extends PgTable>(table: T,criteria: Partial<InferInsertModel<T>>) {
  try {    
    const columns = getTableColumns(table);
    const filters = Object.entries(criteria).map(([key, value]) => {  
      const columnReference = columns[key];

      if (!columnReference) {
        throw new Error(`Column ${key} not found in table ${table}`);
      }

      // Create the comparison: id = 'some-uuid'
      return eq(columnReference, value);
    });

    // 2. Apply the filters to the delete query
    await dbAdmin
      .delete(table as any)
      .where(and(...filters));

    return true;
  } catch (error) {
    console.error("Error deleting row:", error);
    return false;
  }
}

export async function searchItem<T extends PgTable<TableConfig>>(table: T,criteria: Partial<InferInsertModel<T>>) {

  try {
    const columns = getTableColumns(table);
    const filters = Object.entries(criteria).map(([key, value]) => {  
      const columnReference = columns[key];

      if (!columnReference) {
        throw new Error(`Column ${key} not found in table ${table}`);
      }

      // Create the comparison: id = 'some-uuid'
      return eq(columnReference, value);
    });

    // 2. Apply the filters to the delete query
    const result = await dbAdmin
      .select()
      .from(table as any)
      .where(and(...filters));

    return result.length > 0;
  } catch (error) {
    console.error(`Search error in ${table._.name}:`, error);
    return false;
  }
}

export async function getItem<T extends PgTable<TableConfig>>(table: T,criteria: Partial<InferInsertModel<T>>) {

  try {
    const columns = getTableColumns(table);
    const entries = Object.entries(criteria);

    // 1. If criteria is empty, just select all
    if (entries.length === 0) {
      return await dbAdmin.select().from(table as any);
    }

    const filters = entries.map(([key, value]) => {  
      const columnReference = columns[key];

      if (!columnReference) {
        throw new Error(`Column ${key} not found in table ${table}`);
      }

      // Create the comparison: id = 'some-uuid'
      return eq(columnReference, value);
    });

    // 2. Apply the filters to the delete query
    const result = await dbAdmin
      .select()
      .from(table as any)
      .where(and(...filters));

    return result;
  } catch (error) {
    console.error(`Search error in ${table._.name}:`, error);
    return [];
  }
}

