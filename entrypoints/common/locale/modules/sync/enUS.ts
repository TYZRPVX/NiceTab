import { LocaleKey } from './zhCN';

const enUS: Record<LocaleKey, string> = {
  'sync.settings': 'Sync settings',
  'sync.autoSync': 'Automatic sync',
  'sync.syncing': 'Syncing',
  'sync.noAccessToken': 'Add an access token to sync.',
  'sync.noGithubToken': 'Add a GitHub access token to sync.',
  'sync.noGiteeToken': 'Add a Gitee access token to sync.',
  'sync.syncType.auto': 'Auto',
  'sync.syncType.autoPullMerge': 'Automatic: download and merge',
  'sync.syncType.autoPullForce': 'Automatic: download and replace local data',
  'sync.syncType.autoPushMerge': 'Automatic: merge and upload',
  'sync.syncType.autoPushForce': 'Automatic: upload and replace remote data',
  'sync.syncType.manualPullMerge': 'Manual: download and merge',
  'sync.syncType.manualPullForce': 'Manual: download and replace local data',
  'sync.syncType.manualPushMerge': 'Manual: merge and upload',
  'sync.syncType.manualPushForce': 'Manual: upload and replace remote data',
  'sync.lastSyncTime': 'Last synced',
  'sync.lastSyncType': 'Last sync method',
  'sync.lastSyncResult': 'Last sync result',
  'sync.syncTime': 'Time',
  'sync.syncType': 'Method',
  'sync.syncResult': 'Result',
  'sync.actionTip': 'Confirm sync',
  'sync.actionTip.manualPullForce':
    'Replace local data with the remote copy? Items that exist only locally will be removed.',
  'sync.actionTip.manualPushForce':
    'Replace remote data with the local copy? Items that exist only remotely will be removed.',
  'sync.tip.auto': 'Automatically merge local and remote data, then upload the result.',
  'sync.tip.autoPullMerge':
    'Download remote data and merge it into local data automatically.',
  'sync.tip.autoPullForce': 'Replace local data with remote data automatically.',
  'sync.tip.autoPushMerge':
    'Merge local and remote data, then upload the result automatically.',
  'sync.tip.autoPushForce': 'Replace remote data with local data automatically.',
  'sync.tip.manualPullMerge': 'Download remote data and merge it into local data.',
  'sync.tip.manualPullForce': 'Replace local data with remote data.',
  'sync.tip.manualPushMerge': 'Merge local and remote data, then upload the result.',
  'sync.tip.manualPushForce': 'Replace remote data with local data.',
  'sync.tip.resetStatus': 'Reset sync status',
  'sync.tip.tokenChange':
    'Changing the access token clears the {type} sync history on this device.',
  // 'sync.tip.contentTooLarge': 'Remote file too large, truncated by gist API; cannot merge to local.',
  'sync.tip.syncHistory':
    'The 50 most recent sync records are kept. You can clear them at any time.',
  'sync.tip.supportTip':
    'Sync your saved tabs across devices. To include preferences, enable “Include preferences when syncing saved tabs?” in Settings.',
  'sync.getYourToken': 'Get or manage access token',
  'sync.syncHistory': 'Sync history',
  'sync.noSyncHistory': 'No sync history yet',
  'sync.clearSyncHistory': 'Clear sync history',
  'sync.removeDesc': 'Remove this sync configuration?',
  'sync.noWebdavConnectionUrl': 'Enter a WebDAV server URL to sync.',
  'sync.pushToAllRemotes': 'Replace data on all remotes',

  'sync.reason.contentTooLarge':
    'The Gist API returned an incomplete file because it was too large. Merge cancelled.',
  'sync.reason.authFailed': 'Authentication failed. Check your credentials.',

  'sync.connectionName': 'Connection name',
  'sync.connectionUrl': 'WebDAV server URL',
  'sync.username': 'Username',
  'sync.password': 'Password',
  'sync.addConfig': 'Add connection',
  'sync.tip.connectionName': 'A name to identify this WebDAV connection.',
  'sync.tip.directory':
    'Folder on the WebDAV server. Nested folders are supported, e.g. <strong>/dir/subdir</strong>.',
  'sync.tip.filename':
    'Name of the sync file, e.g. <strong>nicetab-sync.txt</strong>. Any file extension is allowed.',

  // Backup related
  'sync.bakFilename': 'Backup filename',
  'sync.tip.bakFilenameGists': 'Name of the remote backup file used for recovery.',
  'sync.bakDirectory': 'Backup folder',
  'sync.tip.bakDirectory':
    'Remote backup folder on the WebDAV server, e.g. <strong>/dir/subdir</strong>.',
};

export default enUS;
