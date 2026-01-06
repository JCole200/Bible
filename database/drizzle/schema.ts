import { pgTable, serial, text, varchar, integer, jsonb, timestamp, uniqueIndex, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// 1. Strong Definitions Table
export const strongDefinitions = pgTable('strong_definitions', {
    strongsId: varchar('strongs_id', { length: 10 }).primaryKey(),
    lemma: varchar('lemma', { length: 100 }).notNull(),
    transliteration: varchar('transliteration', { length: 100 }),
    pronunciation: varchar('pronunciation', { length: 100 }),
    definition: text('definition').notNull(),
    morphology: jsonb('morphology').default({}),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// 2. Verses Table
export const verses = pgTable('verses', {
    id: serial('id').primaryKey(),
    book: varchar('book', { length: 50 }).notNull(),
    chapter: integer('chapter').notNull(),
    verse: integer('verse').notNull(),
    version: varchar('version', { length: 10 }).default('KJV').notNull(),
    text: text('text').notNull(),
    metadata: jsonb('metadata').default({}),
}, (t) => ({
    lookupIdx: index('idx_verses_lookup').on(t.book, t.chapter, t.verse),
    uniqueVerse: uniqueIndex('idx_unique_verse').on(t.book, t.chapter, t.verse, t.version),
}));

// 3. Lexicon Map (Join Table)
export const lexiconMap = pgTable('lexicon_map', {
    id: serial('id').primaryKey(),
    verseId: integer('verse_id').references(() => verses.id, { onDelete: 'cascade' }),
    strongsId: varchar('strongs_id', { length: 10 }).references(() => strongDefinitions.strongsId),
    wordText: varchar('word_text', { length: 100 }).notNull(),
    wordIndex: integer('word_index').notNull(),
    morphologyOverride: jsonb('morphology_override'),
    createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({
    verseIdx: index('idx_lexicon_verse').on(t.verseId),
    strongsIdx: index('idx_lexicon_strongs').on(t.strongsId),
}));

// Relations
export const strongDefinitionsRelations = relations(strongDefinitions, ({ many }) => ({
    lexiconMaps: many(lexiconMap),
}));

export const versesRelations = relations(verses, ({ many }) => ({
    lexiconMaps: many(lexiconMap),
}));

export const lexiconMapRelations = relations(lexiconMap, ({ one }) => ({
    verse: one(verses, {
        fields: [lexiconMap.verseId],
        references: [verses.id],
    }),
    strongDefinition: one(strongDefinitions, {
        fields: [lexiconMap.strongsId],
        references: [strongDefinitions.strongsId],
    }),
}));
