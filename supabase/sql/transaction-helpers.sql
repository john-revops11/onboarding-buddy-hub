
-- These functions are no longer being used in the application and can be dropped
-- However, we'll keep them in the database for now in case they're needed in the future

-- Create transaction helper functions
CREATE OR REPLACE FUNCTION public.begin_transaction()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- This is a no-op in PostgreSQL since transactions are implicit
  -- We have this function for API consistency
  NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.commit_transaction()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- This is a no-op in PostgreSQL since transactions are implicit
  -- We have this function for API consistency
  NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.rollback_transaction()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- This will rollback the current transaction
  RAISE EXCEPTION 'Transaction rolled back';
END;
$$;
