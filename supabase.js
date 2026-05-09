// ─────────────────────────────────────────────────
// laize.ai — Supabase connection
// Import this in every HTML page:
// <script src="supabase.js"></script>
//
// Then use window.db anywhere in your page scripts.
// ─────────────────────────────────────────────────

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ── YOUR CREDENTIALS ──────────────────────────────
// Replace these with your real values from:
// Supabase → Settings → API
const SUPABASE_URL  = 'https://tgqerlsmnwcokbmoguak.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRncWVybHNtbndjb2tibW9ndWFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMTAxNjMsImV4cCI6MjA5Mzg4NjE2M30.M_MANQYWDIZe9Kfuw2pnrupc2RdiN5l6xIzf-OZJd6c';
// ─────────────────────────────────────────────────

export const db = createClient(SUPABASE_URL, SUPABASE_ANON);

// Make it available globally so plain script tags can use it
window.db = db;

// ── HELPER: load tools by sector ──────────────────
export async function getToolsBySector(sector, filters = {}) {
  let query = db
    .from('tools')
    .select(`
      id, name, slug, tagline, description,
      logo_letter, logo_color, sector, tags,
      skill_level, pricing_model, starting_price,
      has_free_plan, rating_overall, rating_count,
      total_raised_usd, valuation_usd, valuation_conf,
      growth_signal, users_count, created_at
    `)
    .eq('status', 'approved')
    .eq('sector', sector)
    .order('rating_overall', { ascending: false, nullsFirst: false });

  if (filters.pricing === 'Free tier') query = query.eq('pricing_model', 'Free tier');
  if (filters.pricing === 'Paid')      query = query.eq('pricing_model', 'Paid');
  if (filters.skill === '1')           query = query.eq('skill_level', 'Beginner');
  if (filters.skill === '2')           query = query.eq('skill_level', 'Intermediate');
  if (filters.skill === '3')           query = query.eq('skill_level', 'Advanced');
  if (filters.search)                  query = query.ilike('name', `%${filters.search}%`);

  const { data, error } = await query;
  if (error) { console.error('getToolsBySector:', error); return []; }
  return data;
}

// ── HELPER: load one tool by slug ─────────────────
export async function getToolBySlug(slug) {
  const { data, error } = await db
    .from('tools')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'approved')
    .single();

  if (error) { console.error('getToolBySlug:', error); return null; }
  return data;
}

// ── HELPER: load funding rounds for a tool ────────
export async function getFundingRounds(toolId) {
  const { data, error } = await db
    .from('funding_rounds')
    .select('*')
    .eq('tool_id', toolId)
    .order('announced_date', { ascending: false });

  if (error) { console.error('getFundingRounds:', error); return []; }
  return data;
}

// ── HELPER: load features for a tool ─────────────
export async function getToolFeatures(toolId) {
  const { data, error } = await db
    .from('tool_features')
    .select('*')
    .eq('tool_id', toolId)
    .order('name');

  if (error) { console.error('getToolFeatures:', error); return []; }
  return data;
}

// ── HELPER: load approved reviews for a tool ──────
export async function getReviews(toolId) {
  const { data, error } = await db
    .from('reviews')
    .select('*')
    .eq('tool_id', toolId)
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error) { console.error('getReviews:', error); return []; }
  return data;
}

// ── HELPER: submit a review ───────────────────────
export async function submitReview(toolId, review) {
  const { data, error } = await db
    .from('reviews')
    .insert({
      tool_id:        toolId,
      reviewer_name:  review.name,
      reviewer_role:  review.role,
      rating:         review.rating,
      body:           review.body,
      tags:           review.tags || [],
      score_ease:     review.scoreEase || null,
      score_quality:  review.scoreQuality || null,
      score_value:    review.scoreValue || null,
      status:         'pending',
    })
    .select()
    .single();

  if (error) { console.error('submitReview:', error); return null; }
  return data;
}

// ── HELPER: submit a correction ───────────────────
export async function submitCorrection(toolId, correction) {
  const { data, error } = await db
    .from('corrections')
    .insert({
      tool_id:       toolId,
      field_name:    correction.field,
      current_value: correction.currentValue,
      correct_value: correction.correctValue,
      source_url:    correction.sourceUrl,
      notes:         correction.notes,
      status:        'pending',
    })
    .select()
    .single();

  if (error) { console.error('submitCorrection:', error); return null; }
  return data;
}

// ── HELPER: trending tools for homepage ───────────
export async function getTrendingTools(limit = 6) {
  const { data, error } = await db
    .from('tools')
    .select(`
      id, name, slug, tagline,
      logo_letter, logo_color, sector, tags,
      pricing_model, skill_level,
      rating_overall, rating_count, created_at
    `)
    .eq('status', 'approved')
    .order('rating_count', { ascending: false })
    .limit(limit);

  if (error) { console.error('getTrendingTools:', error); return []; }
  return data;
}

// ── HELPER: sector counts for homepage ────────────
export async function getSectorCounts() {
  const { data, error } = await db
    .from('tools')
    .select('sector')
    .eq('status', 'approved');

  if (error) { console.error('getSectorCounts:', error); return {}; }

  return data.reduce((acc, row) => {
    acc[row.sector] = (acc[row.sector] || 0) + 1;
    return acc;
  }, {});
}
