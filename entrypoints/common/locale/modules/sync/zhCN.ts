const zhCN = {
  'sync.settings': '同步设置',
  'sync.autoSync': '自动同步',
  'sync.syncing': '正在同步',
  'sync.noAccessToken': '请先添加访问令牌。',
  'sync.noGithubToken': '请先添加 GitHub 访问令牌。',
  'sync.noGiteeToken': '请先添加 Gitee 访问令牌。',
  'sync.syncType.auto': '自动同步',
  'sync.syncType.autoPullMerge': '自动：下载并合并到本地',
  'sync.syncType.autoPullForce': '自动：下载并覆盖本地数据',
  'sync.syncType.autoPushMerge': '自动：合并后上传',
  'sync.syncType.autoPushForce': '自动：上传并覆盖远程数据',
  'sync.syncType.manualPullMerge': '手动：下载并合并到本地',
  'sync.syncType.manualPullForce': '手动：下载并覆盖本地数据',
  'sync.syncType.manualPushMerge': '手动：合并后上传',
  'sync.syncType.manualPushForce': '手动：上传并覆盖远程数据',
  'sync.lastSyncTime': '上次同步时间',
  'sync.lastSyncType': '上次同步方式',
  'sync.lastSyncResult': '上次同步结果',
  'sync.syncTime': '同步时间',
  'sync.syncType': '同步方式',
  'sync.syncResult': '同步结果',
  'sync.actionTip': '确认同步操作',
  'sync.actionTip.manualPullForce':
    '用远程数据覆盖本地数据？仅存在于本地的项目将被移除。',
  'sync.actionTip.manualPushForce':
    '用本地数据覆盖远程数据？仅存在于远程的项目将被移除。',
  'sync.tip.auto': '自动合并本地与远程数据，再上传合并结果。',
  'sync.tip.autoPullMerge': '自动下载远程数据并合并到本地。',
  'sync.tip.autoPullForce': '自动使用远程数据覆盖本地数据。',
  'sync.tip.autoPushMerge': '自动合并本地与远程数据，再上传合并结果。',
  'sync.tip.autoPushForce': '自动使用本地数据覆盖远程数据。',
  'sync.tip.manualPullMerge': '下载远程数据并合并到本地。',
  'sync.tip.manualPullForce': '使用远程数据覆盖本地数据。',
  'sync.tip.manualPushMerge': '合并本地与远程数据，再上传合并结果。',
  'sync.tip.manualPushForce': '使用本地数据覆盖远程数据。',
  'sync.tip.resetStatus': '重置同步状态',
  'sync.tip.tokenChange': '修改访问令牌会清空此设备上的 {type} 同步历史。',
  // 'sync.tip.contentTooLarge': '远程文件内容太大，返回的内容被 gist API 截断了，取消合并到本地',
  'sync.tip.syncHistory': '保留最近 50 条同步记录，也可随时手动清空。',
  'sync.tip.supportTip':
    '在设备间同步已保存标签页。如需同时同步偏好设置，请在设置中开启“同步已保存标签页时包含偏好设置”。',
  'sync.getYourToken': '获取或管理访问令牌',
  'sync.syncHistory': '同步历史',
  'sync.noSyncHistory': '暂无同步记录',
  'sync.clearSyncHistory': '清空同步历史',
  'sync.removeDesc': '删除此同步配置？',
  'sync.noWebdavConnectionUrl': '请先填写 WebDAV 服务器地址。',
  'sync.pushToAllRemotes': '覆盖所有远程存储的数据',

  'sync.reason.contentTooLarge': '文件过大，Gist API 返回的内容不完整，已取消合并。',
  'sync.reason.authFailed': '身份验证失败，请检查凭据。',

  'sync.connectionName': '连接名称',
  'sync.connectionUrl': 'WebDAV 服务器地址',
  'sync.username': '用户名',
  'sync.password': '密码',
  'sync.addConfig': '添加连接',
  'sync.tip.connectionName': '为此 WebDAV 连接设置一个易于识别的名称。',
  'sync.tip.directory':
    'WebDAV 服务器上的目录，支持多级路径，如 <strong>/dir/subdir</strong>。',
  'sync.tip.filename':
    '同步文件名，例如 <strong>nicetab-sync.txt</strong>，可使用任意扩展名。',

  // 备份相关
  'sync.bakFilename': '备份文件名',
  'sync.tip.bakFilenameGists': '用于数据恢复的远程备份文件名。',
  'sync.bakDirectory': '备份目录',
  'sync.tip.bakDirectory':
    'WebDAV 服务器上的备份目录，例如 <strong>/dir/subdir</strong>。',
};

export type LocaleKey = keyof typeof zhCN;

export default zhCN;
