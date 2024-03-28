import { BaseModel, orm } from '../database.js';

@orm.model()
export class GuildSettings extends BaseModel {
    @orm.columnType('string')
    public notifyRole!: Snowflake;

    @orm.columnType('string')
    public notifyChannel!: Snowflake;
}
