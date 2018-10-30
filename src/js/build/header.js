const packageInfo = require('../../../package');

module.exports = () => `${packageInfo.name} - ${packageInfo.description}
@link ${packageInfo.homepage}
@version ${packageInfo.version}
@license ${packageInfo.license}

${packageInfo.name} includes some scripts provided under different licenses by their authors. Please visit ${packageInfo.homepage} for more information.`;
