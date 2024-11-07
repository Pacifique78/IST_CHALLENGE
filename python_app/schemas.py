from marshmallow import Schema, fields

class UserSchema(Schema):
    id = fields.UUID(dump_only=True)
    name = fields.Str(required=True, description="User's full name")
    email = fields.Email(required=True, description="User's email address")
    password = fields.Str(required=True, load_only=True, description="User's password")
    created_at = fields.DateTime(dump_only=True)

class UserResponseSchema(Schema):
    id = fields.UUID()
    name = fields.Str()
    email = fields.Email()
    created_at = fields.DateTime()

class LoginRequestSchema(Schema):
    email = fields.Email(required=True, description="User's email address")
    password = fields.Str(required=True, description="User's password")

class LoginResponseSchema(Schema):
    access_token = fields.Str()
    user = fields.Nested(UserResponseSchema)

class TodoSchema(Schema):
    id = fields.UUID(dump_only=True)
    title = fields.Str(required=True, description="Todo title")
    description = fields.Str(description="Todo description")
    completed = fields.Bool(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

class TodoCreateSchema(Schema):
    title = fields.Str(required=True, description="Todo title")
    description = fields.Str(description="Todo description")