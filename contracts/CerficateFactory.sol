pragma solidity ^0.5.0;

contract CertificateFactory {
    struct Certificate {
        // uint256 id;
        address student;
        address nextVerification;
        string[] fields;
        uint256 level;
        bool isVerified;
        string verificationKey;
    }

    Certificate[] public certificates;
    mapping(address => uint256) pendingApprovalCount;

    function createCertificate(address _nextVerification, string[] fields)
        public
        returns (uint newCertificateId)
    {
        uint id = ceritificates.push(
            Certificate(
                msg.sender,
                _nextVerification,
                fields,
                0,
                false,
                uint256(keccak256(now))
            )
        );
        return id;
    }

    // function getCertificates() public view returns (Certificate[]) {
    //     return certificates;
    // }
    function getCertificateById(uint256 _id, string _verificationKey)
        public
        view
        returns (Certificate)
    {
        require(
            msg.sender == certificates[_id].student ||
                _verificationKey == certificates[_id].verificationKey
        );
        return certificates[_id];
    }

    function verifyCertificateByKey(string _verificationKey)
        public
        view
        returns (Certificate)
    {
        Certificate certificate;
        for (uint256 i = 0; i < certificates.length; i++) {
            if (certificates[i].verificationKey == _verificationKey) {
                certificate = certificates[i];
            }
        }
        return certificate;

    }

    function getPendingApprovals() public view returns (Certificates[]) {
        Certificate[] memory result = new Certificate[](
            pendingApprovalCount[msg.sender]
        );
        uint256 counter = 0;
        for (uint256 i = 0; i < certificates.length; i++) {
            if (certificates[i].nextVerification == msg.sender) {
                result[counter] = certificates[i];
                counter++;
            }
        }
        return result;

    }

    function approve(uint256 _certificateId, address _newNextVerification)
        public
    {
        require(msg.sender == certificates[_certificateId].nextVerification);
        ceritificates[_certificateId].level++;
        pendingApprovalCount[ceritificates[_certificateId].nextVerification]--;
        ceritificates[_certificateId].nextVerification = _newNextVerification;
        pendingApprovalCount[_newNextVerification]++;
        if (_newNextVerification == address(0)) {
            ceritificates[_certificateId].isVerified = true;
        }
    }

}
