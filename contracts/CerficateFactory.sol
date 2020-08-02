pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract CertificateFactory {
    struct Certificate {
        // uint256 id;
        address student;
        address nextVerification;
        string[] fields;
        uint256 level;
        bool isVerified;
        uint256 verificationKey;
        bool isRejected;
    }

    event NewCertificate(uint id);
    Certificate[] public certificates;
    mapping(address => uint256) pendingApprovalCount;

    function createCertificate(address _nextVerification, string[] memory fields)
        public
    {
        certificates.push(
            Certificate(
                msg.sender,
                _nextVerification,
                fields,
                0,
                false,
                uint256(keccak256(abi.encodePacked(now))),
                false
            )
        );
    }

    function getLastCertificateIndex() public view returns (uint len) {
        return certificates.length;
    }

    // function getCertificates() public view returns (Certificate[]) {
    //     return certificates;
    // }
    function getCertificateById(uint256 _id, uint256 _verificationKey)
        public
        view
        returns (Certificate memory)
    {
        require(
            msg.sender == certificates[_id].student ||
                _verificationKey == certificates[_id].verificationKey
        );
        return certificates[_id];
    }

    function verifyCertificateByKey(uint256 _verificationKey)
        public
        view
        returns (Certificate memory)
    {
        Certificate memory certificate;
        for (uint256 i = 0; i < certificates.length; i++) {
            if (certificates[i].verificationKey == _verificationKey) {
                certificate = certificates[i];
            }
        }
        return certificate;

    }

    function getPendingApprovals() public view returns (Certificate[] memory) {
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
        certificates[_certificateId].level++;
        pendingApprovalCount[certificates[_certificateId].nextVerification]--;
        certificates[_certificateId].nextVerification = _newNextVerification;
        pendingApprovalCount[_newNextVerification]++;
        if (_newNextVerification == address(0)) {
            certificates[_certificateId].isVerified = true;
        }
    }

    function reject(uint256 _certificateId)
        public
    {
        require(msg.sender == certificates[_certificateId].nextVerification);
        pendingApprovalCount[certificates[_certificateId].nextVerification]--;
        certificates[_certificateId].isRejected = true;
    }

}
