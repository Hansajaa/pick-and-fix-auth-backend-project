DROP PROCEDURE IF EXISTS create_user;
DELIMITER //

CREATE PROCEDURE create_user(
    IN p_username VARCHAR(255),
    IN p_contactNumber VARCHAR(255),
    IN p_email VARCHAR(255),
    IN p_password VARCHAR(255) -- ⚠️ This must be pre-hashed using argon2 in the app
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
            ROLLBACK;
            SELECT 'Error: Transaction rolled back due to SQL exception' AS error_message;
        END;

    START TRANSACTION;

    INSERT INTO tbl_user (
        username,
        contactNumber,
        email,
        password,
        createdAt,
        updatedAt
    ) VALUES (
                 p_username,
                 p_contactNumber,
                 p_email,
                 p_password,
                 NOW(),
                 NOW()
             );

    COMMIT;
    SELECT 'User created successfully' AS message;
END //

DELIMITER ;
