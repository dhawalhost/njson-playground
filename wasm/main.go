//go:build js && wasm

package main

import (
	"encoding/json"
	"fmt" // Added for error formatting in batchWrapper
	"syscall/js"

	"github.com/dhawalhost/nqjson"
)

func getWrapper(this js.Value, args []js.Value) interface{} {
	if len(args) < 2 {
		return map[string]interface{}{"error": "need json and path"}
	}
	jsonStr := args[0].String()
	path := args[1].String()
	res := nqjson.Get(json.RawMessage(jsonStr), path)
	if !res.Exists() {
		return map[string]interface{}{"exists": false, "type": "null"}
	}
	out := map[string]interface{}{"exists": true}
	switch res.Type {
	case nqjson.TypeString:
		out["type"] = "string"
		out["string"] = res.String()
	case nqjson.TypeNumber:
		out["type"] = "number"
		out["number"] = res.Float()
	case nqjson.TypeBoolean:
		out["type"] = "boolean"
		out["bool"] = res.Bool()
	case nqjson.TypeArray:
		out["type"] = "array"
		var v any
		_ = json.Unmarshal(res.Raw, &v)
		out["value"] = v
	case nqjson.TypeObject:
		out["type"] = "object"
		var v any
		_ = json.Unmarshal(res.Raw, &v)
		out["value"] = v
	default:
		out["type"] = "null"
	}
	return out
}

func setWrapper(this js.Value, args []js.Value) interface{} {
	if len(args) < 3 {
		return map[string]interface{}{"error": "need json, path and value"}
	}
	jsonStr := args[0].String()
	path := args[1].String()
	valStr := args[2].String()
	b, err := nqjson.Set(json.RawMessage(jsonStr), path, json.RawMessage(valStr))
	if err != nil {
		return map[string]interface{}{"error": err.Error()}
	}
	return map[string]interface{}{"json": string(b)}
}

func deleteWrapper(this js.Value, args []js.Value) interface{} {
	if len(args) < 2 {
		return map[string]interface{}{"error": "need json and path"}
	}
	jsonStr := args[0].String()
	path := args[1].String()
	b, err := nqjson.Delete(json.RawMessage(jsonStr), path)
	if err != nil {
		return map[string]interface{}{"error": err.Error()}
	}
	return map[string]interface{}{"json": string(b)}
}

func batchWrapper(this js.Value, args []js.Value) interface{} {
	if len(args) < 2 {
		return map[string]interface{}{"error": "need json and operations array"}
	}
	jsonStr := args[0].String()
	opsJSONStr := args[1].String() // Expecting a JSON string representing the operations array

	var operations []map[string]interface{}
	if err := json.Unmarshal([]byte(opsJSONStr), &operations); err != nil {
		return map[string]interface{}{"error": fmt.Sprintf("failed to parse operations: %v", err)}
	}

	currentJSON := json.RawMessage(jsonStr)
	results := make([]interface{}, len(operations))

	for i, op := range operations {
		opType, ok := op["type"].(string)
		if !ok {
			results[i] = map[string]interface{}{"error": "operation 'type' missing or not a string"}
			continue
		}
		path, ok := op["path"].(string)
		if !ok {
			results[i] = map[string]interface{}{"error": "operation 'path' missing or not a string"}
			continue
		}

		switch opType {
		case "get":
			res := nqjson.Get(currentJSON, path)
			if !res.Exists() {
				results[i] = map[string]interface{}{"exists": false, "type": "null"}
				continue
			}
			out := map[string]interface{}{"exists": true}
			switch res.Type {
			case nqjson.TypeString:
				out["type"] = "string"
				out["string"] = res.String()
			case nqjson.TypeNumber:
				out["type"] = "number"
				out["number"] = res.Float()
			case nqjson.TypeBoolean:
				out["type"] = "boolean"
				out["bool"] = res.Bool()
			case nqjson.TypeArray:
				out["type"] = "array"
				var v any
				_ = json.Unmarshal(res.Raw, &v)
				out["value"] = v
			case nqjson.TypeObject:
				out["type"] = "object"
				var v any
				_ = json.Unmarshal(res.Raw, &v)
				out["value"] = v
			default:
				out["type"] = "null"
			}
			results[i] = out
		case "set":
			val, valOk := op["value"]
			if !valOk {
				results[i] = map[string]interface{}{"error": "set operation 'value' missing"}
				continue
			}
			valBytes, err := json.Marshal(val)
			if err != nil {
				results[i] = map[string]interface{}{"error": fmt.Sprintf("failed to marshal set value: %v", err)}
				continue
			}
			newJSON, err := nqjson.Set(currentJSON, path, valBytes)
			if err != nil {
				results[i] = map[string]interface{}{"error": err.Error()}
				continue
			}
			currentJSON = newJSON
			results[i] = map[string]interface{}{"status": "success"}
		case "delete":
			newJSON, err := nqjson.Delete(currentJSON, path)
			if err != nil {
				results[i] = map[string]interface{}{"error": err.Error()}
				continue
			}
			currentJSON = newJSON
			results[i] = map[string]interface{}{"status": "success"}
		default:
			results[i] = map[string]interface{}{"error": fmt.Sprintf("unknown operation type: %s", opType)}
		}
	}

	return map[string]interface{}{
		"json":    string(currentJSON),
		"results": results,
	}
}

func main() {
	js.Global().Set("nqjsonGet", js.FuncOf(getWrapper))
	js.Global().Set("nqjsonSet", js.FuncOf(setWrapper))
	js.Global().Set("nqjsonDelete", js.FuncOf(deleteWrapper))
	js.Global().Set("nqjsonBatch", js.FuncOf(batchWrapper)) // Batch operations

	// Keep running
	select {}
}
