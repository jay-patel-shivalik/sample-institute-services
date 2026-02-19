module.exports = {
  async up(db, client) {
    await db.createCollection("institutecourses", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          properties: {
            name: {
              bsonType: "string",
            },
            status: {
              bsonType: "string",
            },
            price: {
                bsonType: "string",
            },
            discount: {
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
    await db.collection('institutecourses').drop();
  }
};
