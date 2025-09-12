package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/dhawalhost/njson"
)

type getReq struct {
	JSON json.RawMessage `json:"json"`
	Path string          `json:"path"`
}

type getResp struct {
	Exists bool     `json:"exists"`
	Type   string   `json:"type"`
	Value  any      `json:"value,omitempty"`
	String string   `json:"string,omitempty"`
	Number *float64 `json:"number,omitempty"`
	Bool   *bool    `json:"bool,omitempty"`
	Error  string   `json:"error,omitempty"`
}

type setReq struct {
	JSON  json.RawMessage `json:"json"`
	Path  string          `json:"path"`
	Value json.RawMessage `json:"value"`
}

type setResp struct {
	JSON  json.RawMessage `json:"json,omitempty"`
	Error string          `json:"error,omitempty"`
}

func writeJSON(w http.ResponseWriter, status int, v interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func handleGet(w http.ResponseWriter, r *http.Request) {
	var req getReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, getResp{Error: "invalid request"})
		return
	}
	res := njson.Get(req.JSON, req.Path)
	if !res.Exists() {
		writeJSON(w, http.StatusOK, getResp{Exists: false, Type: "null"})
		return
	}
	out := getResp{Exists: true}
	switch res.Type {
	case njson.TypeString:
		out.Type = "string"
		out.String = res.String()
	case njson.TypeNumber:
		out.Type = "number"
		f := res.Float()
		out.Number = &f
	case njson.TypeBoolean:
		out.Type = "boolean"
		b := res.Bool()
		out.Bool = &b
	case njson.TypeArray:
		out.Type = "array"
		var v any
		_ = json.Unmarshal(res.Raw, &v)
		out.Value = v
	case njson.TypeObject:
		out.Type = "object"
		var v any
		_ = json.Unmarshal(res.Raw, &v)
		out.Value = v
	default:
		out.Type = "null"
	}
	writeJSON(w, http.StatusOK, out)
}

func handleSetLike(op string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req setReq
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			writeJSON(w, http.StatusBadRequest, setResp{Error: "invalid request"})
			return
		}
		var (
			result []byte
			err    error
		)
		switch op {
		case "set":
			result, err = njson.Set(req.JSON, req.Path, json.RawMessage(req.Value))
			if err != nil {
				writeJSON(w, http.StatusBadRequest, setResp{Error: err.Error()})
				return
			}
		case "delete":
			result, err = njson.Delete(req.JSON, req.Path)
			if err != nil {
				writeJSON(w, http.StatusBadRequest, setResp{Error: err.Error()})
				return
			}
		}
		writeJSON(w, http.StatusOK, setResp{JSON: json.RawMessage(result)})
	}
}

func main() {
	mux := http.NewServeMux()
	fs := http.FileServer(http.Dir("./web"))
	mux.Handle("/", http.StripPrefix("/", fs))

	mux.HandleFunc("/api/get", handleGet)
	mux.HandleFunc("/api/set", handleSetLike("set"))
	mux.HandleFunc("/api/delete", handleSetLike("delete"))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("njson playground listening on :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, mux))
}
