export class User {
    constructor({ user_id, user_name, user_email, user_password, user_created}) {
        this.user_id = user_id;
        this.user_name = user_name;
        this.user_email = user_email;
        this.user_password = user_password;
        this.user_created = user_created
    }
}