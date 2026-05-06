-- created_by FK: SET NULL → CASCADE
ALTER TABLE tasks DROP CONSTRAINT tasks_created_by_fkey;
ALTER TABLE tasks
  ADD CONSTRAINT tasks_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 인증 전에 삽입된 row 정리 후 NOT NULL 강화
DELETE FROM tasks WHERE created_by IS NULL;
ALTER TABLE tasks ALTER COLUMN created_by SET NOT NULL;

-- 임시 전체 허용 정책 제거
DROP POLICY IF EXISTS temp_all_access ON tasks;

-- 정식 RLS 정책 4종
CREATE POLICY tasks_select ON tasks
  FOR SELECT USING (
    auth.uid() = created_by
    OR auth.uid() = assignee_id
  );

CREATE POLICY tasks_insert ON tasks
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY tasks_update ON tasks
  FOR UPDATE USING (
    auth.uid() = created_by
    OR auth.uid() = assignee_id
  );

CREATE POLICY tasks_delete ON tasks
  FOR DELETE USING (auth.uid() = created_by);
