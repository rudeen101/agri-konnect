import nodemailer from 'nodemailer';
import { SMTP_CONFIG } from '../config/environment.js';
import EmailTemplate from '../models/EmailTemplate.model.js';
import logger from '../utils/logger.js';
import path from 'path';
import fs from 'fs';
import handlebars from 'handlebars';

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            ...SMTP_CONFIG,
            pool: true,
            maxConnections: 5,
            maxMessages: 100
        });

        // Load template engine
        this.templatesDir = path.join(process.cwd(), 'email-templates');
        this.registerPartials();
        this.registerHelpers();
    }

    // Send email with template
    async sendEmail({ email, subject, template, context, attachments }) {
        try {
            // Get template from DB or filesystem
            let html;
            const dbTemplate = await EmailTemplate.findOne({ name: template });
            
            if (dbTemplate) {
                // Compile DB template
                const compile = handlebars.compile(dbTemplate.content);
                html = compile(context);
            } else {
                // Fallback to filesystem template
                const templatePath = path.join(this.templatesDir, `${template}.hbs`);
                if (!fs.existsSync(templatePath)) {
                    throw new Error(`Template ${template} not found`);
                }
                
                const source = fs.readFileSync(templatePath, 'utf8');
                const compile = handlebars.compile(source);
                html = compile(context);
            }

            // Send email
            const mailOptions = {
                from: `"Admin Dashboard" <${process.env.SMTP_FROM_EMAIL}>`,
                to: email,
                subject,
                html,
                attachments,
                dsn: {
                    id: crypto.randomUUID(),
                    return: 'headers',
                    notify: ['failure', 'delay'],
                    recipient: process.env.SMTP_BOUNCE_EMAIL
                }
            };

            const info = await this.transporter.sendMail(mailOptions);
            logger.info(`Email sent to ${email}: ${info.messageId}`);

            return info;
        } catch (err) {
            logger.error(`Email send failed to ${email}: ${err.message}`);
            throw err;
        }
    }

    // Bulk email sending with rate limiting
    async sendBulkEmails(emails, template, context) {
        const BATCH_SIZE = 20;
        const DELAY_MS = 1000;

        for (let i = 0; i < emails.length; i += BATCH_SIZE) {
            const batch = emails.slice(i, i + BATCH_SIZE);
            await Promise.all(
                batch.map(email => this.sendEmail({ email, template, context }))
            );
            
            if (i + BATCH_SIZE < emails.length) {
                await new Promise(resolve => setTimeout(resolve, DELAY_MS));
            }
        }
    }

    // Template partials registration
    registerPartials() {
        const partialsDir = path.join(this.templatesDir, 'partials');
        if (fs.existsSync(partialsDir)) {
            fs.readdirSync(partialsDir).forEach(partial => {
                const name = path.basename(partial, '.hbs');
                const source = fs.readFileSync(path.join(partialsDir, partial), 'utf8');
                handlebars.registerPartial(name, source);
            });
        }
    }

    // Custom Handlebars helpers
    registerHelpers() {
        handlebars.registerHelper('formatDate', date => {
            return new Date(date).toLocaleDateString();
        });

        handlebars.registerHelper('if_eq', function(a, b, opts) {
            return a === b ? opts.fn(this) : opts.inverse(this);
        });
    }
}

export default new EmailService();