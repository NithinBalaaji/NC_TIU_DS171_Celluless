var certificateFactory = artifacts.require("CertificateFactory");

module.exports = function(deployer) {
  deployer.deploy(certificateFactory);
};