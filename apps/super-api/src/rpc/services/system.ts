import packageJson from '../../../package.json';

export class SystemService {
    async health() {
        return {
            status: 'ok',
        };
    }
    async info() {
        return {
            installedAt: new Date(),
            version: packageJson.version,
            status: 'ok',
        };
    }
}
