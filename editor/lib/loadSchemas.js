const fs = require("fs");
const path = require("path");
const resolvePrototypeForBuiltins = require("./resolvePrototypeForBuiltins");
function validateRootType(object, path) {
  if (!object.name) {
    throw new Error(
      "property 'name' is required for builtin schema object at path" +
        path +
        "\n recieved object:" +
        JSON.stringify(schemaObj)
    );
  } else if (typeof object.name !== "string") {
    throw new TypeError(
      `expected type string for property 'name' but recieved type ${typeof object.name}  builtin schema object at path` +
        path
    );
  } else if (object.name.length === 0) {
    throw new TypeError(
      `expected string for property 'name' to not be empty   builtin schema object at path` +
        path
    );
  } else {
    return true;
  }
}
function resolveConstructorForBuiltinType(schema) {
  let constructorName = schema.name[0].toUpperCase() + schema.name.slice(1);
  console.log(
    `attempting to grab Constructor function for ${constructorName} from library`
  );
  try {
    schema.constructor = require(path.join(
      "lib",
      "types",
      "builtins",
      constructorName
    ));
    schema.prototype = constructor.prototype;
  } catch (e) {
    if (e.code == "MODULE_NOT_FOUND") {
      console.log(
        "did not find constructor function in library for builtin " +
          constructorName +
          ",loading from global scope"
      );
      schema.constructor = global[constructorName] || null;
      if (schema.constructor) {
        schema.prototype = schema.constructor.prototype;
      } else {
        schema.prototype = {};
      }
    }
  }
  return schema;
}
function requireRootTypes(directory) {
  console.log(`reading directory ${directory}`);
  let schemas = fs.readdirSync(directory);
  console.log("filtering directory listing for json files");
  schemas.filter((filepath) => {
    return filepath.endsWith(".json");
  });
  console.log("directory listing found schemas", schemas);
  console.log("building Root Types Schema Object");
  let rootTypes = {};
  schemas.forEach((schemaPath) => {
    let schemaAbsPath = path.join(directory, schemaPath);
    console.log(`requiring schema ${schemaPath}`);
    let schema = require(schemaAbsPath);
    console.log("validating schema");
    if (validateRootType(schema, schemaPath)) {
      schema = resolveConstructorForBuiltinType(schema);
      schema = resolvePrototypeForBuiltins(schema);
      rootTypes[schema.name] = schema;
    }
  });
  return rootTypes;
}

module.exports = function loadSchemas(projectRoot) {
  // load base types first
  let modelsRoot = path.join(projectRoot, "models");
  let typesRoot = path.join(modelsRoot, "types");
  let builtinTypesRoot = path.join(typesRoot, "builtins");
  console.log("Checking if builtin types directory is valid");
  fs.accessSync(builtinTypesRoot);
  console.log(
    "builtin directory is valid, attemting to load schemas for builtins"
  );
  let builtins = requireRootTypes(builtinTypesRoot);
  console.log("loaded schemas for root types", builtins);
  return {
    builtins,
  };
};
