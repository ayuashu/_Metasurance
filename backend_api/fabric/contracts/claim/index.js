const ClaimPolicy = require('./claimPolicy');
const approveClaim = require('./approveClaim');
const rejectClaim = require('./rejectClaim');
const viewClaimedPolicies = require('./viewClaimedPolicies');
const viewAllClaimRequests = require('./viewAllClaimRequests');
module.exports = {
    ClaimPolicy,
    approveClaim,
    rejectClaim,
    viewClaimedPolicies,
    viewAllClaimRequests
}