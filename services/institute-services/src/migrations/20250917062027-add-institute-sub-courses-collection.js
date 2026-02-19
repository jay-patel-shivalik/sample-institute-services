module.exports = {
  async up(db, client) {
    await db.createCollection("institutesubcourses", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          properties: {
            instituteCourseId: {
              bsonType: "objectId",
            },
            name: {
              bsonType: "string",
            },
            price: {
              bsonType: "string",
            },
            discount: {
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
    await db.collection('institutesubcourses').drop();
  }
};
