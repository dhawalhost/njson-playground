//go:build js && wasm

package main

import (
    "encoding/json"
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

func main() {
    js.Global().Set("nqjsonGet", js.FuncOf(getWrapper))
    js.Global().Set("nqjsonSet", js.FuncOf(setWrapper))
    js.Global().Set("nqjsonDelete", js.FuncOf(deleteWrapper))

    // Keep running
    select {}
}
