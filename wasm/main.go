//go:build js && wasm

package main

import (
    "encoding/json"
    "syscall/js"

    "github.com/dhawalhost/njson"
)

func getWrapper(this js.Value, args []js.Value) interface{} {
    if len(args) < 2 {
        return map[string]interface{}{"error": "need json and path"}
    }
    jsonStr := args[0].String()
    path := args[1].String()
    res := njson.Get(json.RawMessage(jsonStr), path)
    if !res.Exists() {
        return map[string]interface{}{"exists": false, "type": "null"}
    }
    out := map[string]interface{}{"exists": true}
    switch res.Type {
    case njson.TypeString:
        out["type"] = "string"
        out["string"] = res.String()
    case njson.TypeNumber:
        out["type"] = "number"
        out["number"] = res.Float()
    case njson.TypeBoolean:
        out["type"] = "boolean"
        out["bool"] = res.Bool()
    case njson.TypeArray:
        out["type"] = "array"
        var v any
        _ = json.Unmarshal(res.Raw, &v)
        out["value"] = v
    case njson.TypeObject:
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
    b, err := njson.Set(json.RawMessage(jsonStr), path, json.RawMessage(valStr))
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
    b, err := njson.Delete(json.RawMessage(jsonStr), path)
    if err != nil {
        return map[string]interface{}{"error": err.Error()}
    }
    return map[string]interface{}{"json": string(b)}
}

func main() {
    js.Global().Set("njsonGet", js.FuncOf(getWrapper))
    js.Global().Set("njsonSet", js.FuncOf(setWrapper))
    js.Global().Set("njsonDelete", js.FuncOf(deleteWrapper))

    // Keep running
    select {}
}
