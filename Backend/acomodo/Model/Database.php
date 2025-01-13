<?php
class Database
{
    protected $connection = null;
    // Constructor function which initializes the database connection when a new object is instantiated
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
    // Generic function for executing select queries
    public function select($query = "", $params = [], $paramTypes = "")
    {
        try {
            $stmt = $this->executeStatement($query, $params, $paramTypes);
            $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
            $stmt->close();
            return $result;
        } catch (Exception $e) {
            customError($e, $e->getMessage(), 500);
        }
        return false;
    }

    // Generic function for executing insert queries
    // Returns an array with format [$insertedRows, $insertedId / $errorNr depending on outcome]
    public function insert($query = "", $params = [], $paramTypes = "")
    {
        try {
            $stmt = $this->executeStatement($query, $params, $paramTypes);
            if ($stmt->errno) {

                return [0, $stmt->errno];
            }
            $rows = $stmt->affected_rows;
            $id = $stmt->insert_id;
            $stmt->close();
            return [$rows, $id];
        } catch (Exception $e) {
            customError("", $e->getMessage(), 400);
        }
        return [0, null];
    }
    // Generic function for executing any MySQL query
    private function executeStatement($query = "", $params = [], $paramTypes = "")
    {
        try {
            $stmt = $this->connection->prepare($query);
            if ($stmt === false) {
                customError("", "Unable to do prepared statement: " . $query, 500);
            }
            if ($params) {
                $stmt->bind_param($paramTypes, ...$params);
            }
            $stmt->execute();
            return $stmt;
        } catch (Exception $e) {
            customError("", $e->getMessage(), 500);
        }
    }
}
