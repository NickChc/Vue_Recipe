import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

/**
 * Deletes unverified users every 30 minutes.
 */
exports.deleteUnverifiedUsers = functions.pubsub
  .schedule("*/30 * * * *")
  .onRun(async () => {
    const unverifiedUsers: string[] = [];

    async function getAllUsers(nextPageToken?: string) {
      const result = await admin.auth().listUsers(1000, nextPageToken);

      result.users.forEach((user) => {
        const now = Date.now();
        const createdAt = Date.parse(user.metadata.creationTime);
        // unverified users who have account for more that 15 minutes will be deleted
        const miliseconds = 30 * 60 * 1000;

        if (!user.emailVerified && now - createdAt > miliseconds) {
          unverifiedUsers.push(user.uid);
        }

        if (result.pageToken) getAllUsers(result.pageToken);
      });
    }

    await getAllUsers();

    const deleteResult = await admin.auth().deleteUsers(unverifiedUsers);

    console.log(deleteResult.successCount);
    console.log(deleteResult.failureCount);
    console.log(deleteResult.errors);
  });
