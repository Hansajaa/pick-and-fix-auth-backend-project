DROP PROCEDURE IF EXISTS create_user;
DELIMITER //

CREATE PROCEDURE create_user(
    IN p_username VARCHAR(255),
    IN p_contactNumber VARCHAR(255),
    IN p_email VARCHAR(255),
    IN p_password VARCHAR(255), -- ⚠️ Must be pre-hashed using argon2 in the app
    IN p_role_id INT
)
BEGIN
    DECLARE new_user_id INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
            ROLLBACK;
            SELECT 'Error: Transaction rolled back due to SQL exception' AS error_message;
        END;

    START TRANSACTION;

    -- Insert new user
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

    -- Get newly inserted user ID
    SET new_user_id = LAST_INSERT_ID();

    -- Insert into user-role mapping table
    INSERT INTO tbl_user_role (
        user,
        role,
        createdAt,
        updatedAt
    ) VALUES (
                 new_user_id,
                 p_role_id,
                 NOW(),
                 NOW()
             );

    COMMIT;

    SELECT 'User with role created successfully' AS message;
END //

DELIMITER ;
