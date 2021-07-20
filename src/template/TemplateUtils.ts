import { createHash } from "crypto";
import { existsSync } from "fs";
import { mkdir, writeFile, readFile, rm } from "fs/promises";
import { dirname } from "path";
import Handlebars from "handlebars";

export async function executeTemplate(fPath: string, fTpl: string, args: any): Promise<string> {
    const dir = dirname(fPath);

    if (!existsSync(dir)) {
        try {
            await mkdir(dir, { recursive: true });
        } catch (err) {
            console.error(err);
            return Promise.reject(err);
        }
    }
    const f: HandlebarsTemplateDelegate = Handlebars.templates[fTpl];

    if (!f) {
        return Promise.reject(`Template not found: ${fTpl}`);
    }

    try {
        const fileContent = f(args);
        await writeFile(fPath, fileContent, 'utf-8');
        return createHash('md5').update(fileContent).digest("hex");
    } catch (err) {
        console.error(err);
        return Promise.reject(err);
    }
}

export async function executeTemplateIfTargetNotEditedByUser(fPath: string, fTpl: string, args: any, overwriteIfHashMatches: string): Promise<string> {
    // If the file does not exist yet, it's okay to create it
    if (!existsSync(fPath)) {
        console.info(`Writing new file at ${fPath}`)
        return executeTemplate(fPath, fTpl, args);
    }

    // If there is no checksum, we can assume the file was already created manually by the user
    if (!overwriteIfHashMatches) {
        console.info(`No checksum received for ${fPath}. Assuming the file was created manually, will not overwrite`);
        return Promise.resolve(null);
    }
    let fileContent;
    let fileChecksum;

    try {
        console.info(`Verifying checksum from ${fPath}.`);

        fileContent = (await readFile(fPath)).toString();

        fileChecksum = createHash('md5').update(fileContent).digest("hex");
    } catch (err) {
        return Promise.reject(err);
    }

    if (overwriteIfHashMatches !== fileChecksum) {
        console.info(`Checksum for ${fPath} is different from generated file, will not overwrite a file that was manually edited`);
        return Promise.resolve(null);
    }

    try {
        console.info(`Updating file ${fPath}.`)
        await rm(fPath);
        const checksum = await executeTemplate(fPath, fTpl, args);
        return Promise.resolve(checksum);
    } catch (err) {
        return Promise.reject(err);
    }

}
