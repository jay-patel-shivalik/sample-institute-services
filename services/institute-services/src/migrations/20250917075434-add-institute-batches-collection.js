module.exports = {
  async up(db, client) {
    await db.createCollection("institutebatches", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          properties: {
            instituteCourseId: {
              bsonType: "objectId",
            },
            instituteSubCourseId: {
              bsonType: ["objectId", "null"],
            },
            batchName: {
              bsonType: "string",
            },
            slug: {
              bsonType: "string",
            },
            startTime: {
              bsonType: "string",
            },
            endTime: {
              bsonType: "string",
            },
            shift: {
              bsonType: "string",
            },
            orientationDate: {
              bsonType: "string",
            },
            registrationEndDate: {
              bsonType: "string",
            },
            startDate: {
              bsonType: "string",
            },
            endDate: {
              bsonType: "string",
            },
            status: {
              bsonType: "string",
            },
            createdBy: {
              bsonType: "objectId",
            },
            updatedBy: {
              bsonType: "objectId",
            },
            createdAt: {
              bsonType: "date",
            },
            updatedAt: {
              bsonType: "date",
            },
            deletedAt: {
              bsonType: "date",
            },
            isDeleted: {
              bsonType: "bool",
            },
          },
        },
      },
    });
  },

  async down(db, client) {
    await db.collection('institutebatches').drop();
  }
};
