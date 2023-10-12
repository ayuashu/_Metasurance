const adminInfo = [
    { name: "user", ca: "ca.user.metasurance.com", msp: "UserMSP" },
    { name: "insurer", ca: "ca.insurer.metasurance.com", msp: "InsurerMSP" }
];

const FabricAPI = require("../fabric/api");

const main = async () => {
    try {
        adminInfo.forEach(async (organization) => {
            console.log("Enrolling", organization);
            await FabricAPI.Account.EnrollAdmin(organization);
        });
    } catch (error) {
        console.error("Enrollment Failed!", error);
    }
};

main();
