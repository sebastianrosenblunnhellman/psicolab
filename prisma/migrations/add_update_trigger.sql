-- Create or replace function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION "neon_auth".update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for comments table
CREATE TRIGGER update_comments_updated_at
BEFORE UPDATE ON "neon_auth"."comments"
FOR EACH ROW
EXECUTE FUNCTION "neon_auth".update_updated_at_column();
