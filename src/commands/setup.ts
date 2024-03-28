import {
    ChannelType,
    ChatInputCommandInteraction,
    GuildTextBasedChannel,
    SlashCommandBuilder,
    SlashCommandChannelOption,
    SlashCommandRoleOption,
} from 'discord.js';
import { UserError } from '../errors.js';
import db from '../database/database.js';
import { GuildSettings } from '../database/models/guild-settings.js';

export const data = new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Setup role and channel where notifications are sent.')
    .addChannelOption(
        new SlashCommandChannelOption()
            .setName('channel')
            .setDescription('The channel where notifications will be sent.')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
    )
    .addRoleOption(
        new SlashCommandRoleOption()
            .setName('role')
            .setDescription('The role that will be mentioned when a new map is posted.')
            .setRequired(true)
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.inGuild()) throw new UserError("This command can't be used in DMs.");

    const channel = interaction.options.getChannel('channel', true) as GuildTextBasedChannel;
    const role = interaction.options.getRole('role', true);

    if (role.managed) {
        throw new UserError('Role must not be managed by an integration.');
    }

    const perms = channel.permissionsFor(interaction.applicationId);
    if (perms == null || !perms.has('SendMessages')) {
        throw new UserError('Bot must have permission to send messages in the selected channel.');
    }

    const settings = db.findOneOptional(GuildSettings, {
        where: {
            clause: 'guildId = ?',
            values: [interaction.guildId],
        },
    });

    if (settings._new) {
        settings.guildId = interaction.guildId;
    }

    settings.notifyChannel = channel.id;
    settings.notifyRole = role.id;

    db.save(settings);

    await interaction.reply({
        content: `Notifications will be sent to <#${channel.id}> and the role <@&${role.id}> will be mentioned.`,
        ephemeral: true,
    });
}
