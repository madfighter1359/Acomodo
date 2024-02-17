<?php
class Database
{
    protected $connection = null;
    public function __construct()
    {
        try {
            $this->connection = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE_NAME);

            if (mysqli_connect_errno()) {
                throw new Exception("Could not connect to database.");
            }
        } catch (Exception $e) {
            http_response_code(500);
            throw new Exception($e->getMessage());
        }
    }
    public function select($query = "", $params = [], $param_types = "")
    {
        try {
            $stmt = $this->executeStatement($query, $params, $param_types);
            $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
            $stmt->close();
            return $result;
        } catch (Exception $e) {
            // trigger_error($e);
            customError($e, $e->getMessage(), 500);
        }
        return false;
    }

    // Returns an array with format [$insertedRows, $insertedId / $errorNr depending on outcome]
    public function insert($query = "", $params = [], $param_types = "")
    {
        try {
            $stmt = $this->executeStatement($query, $params, $param_types);
            if ($stmt->errno) {
                echo $stmt->error;
                return [0, $stmt->errno];
            }
            $rows = $stmt->affected_rows;
            $id = $stmt->insert_id;
            $stmt->close();
            return [$rows, $id];
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
        return [0, null];
    }
    private function executeStatement($query = "", $params = [], $param_types = "")
    {
        try {
            $stmt = $this->connection->prepare($query);
            if ($stmt === false) {
                throw new Exception("Unable to do prepared statement: " . $query);
            }
            if ($params) {
                $stmt->bind_param($param_types, ...$params);
            }
            $stmt->execute();
            return $stmt;
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
    }
}
