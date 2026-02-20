# Architecture Guide - Code Chunker Microservice Integration

## 🏗️ System Architecture

This document explains the complete architecture of integrating the TypeScript code-chunk library with your Python AI agent using a microservice approach.

## 📐 Architecture Layers

### Layer 1: TypeScript Code Analysis Library
```
┌─────────────────────────────────────────────┐
│         code-chunk Library                   │
│         (TypeScript/Node.js)                 │
│                                              │
│  ┌────────────────────────────────────┐    │
│  │  Tree-sitter AST Parsing           │    │
│  │  - Python, TypeScript, JS, Rust... │    │
│  │  - Syntax tree generation          │    │
│  └────────────────────────────────────┘    │
│                    ↓                         │
│  ┌────────────────────────────────────┐    │
│  │  Entity Extraction                  │    │
│  │  - Functions, classes, methods      │    │
│  │  - Imports, types, interfaces       │    │
│  └────────────────────────────────────┘    │
│                    ↓                         │
│  ┌────────────────────────────────────┐    │
│  │  Scope Tree Building                │    │
│  │  - Hierarchical relationships       │    │
│  │  - Parent-child entity mapping      │    │
│  └────────────────────────────────────┘    │
│                    ↓                         │
│  ┌────────────────────────────────────┐    │
│  │  Intelligent Chunking               │    │
│  │  - Semantic boundary detection      │    │
│  │  - Context preservation             │    │
│  └────────────────────────────────────┘    │
│                    ↓                         │
│  ┌────────────────────────────────────┐    │
│  │  Context Enrichment                 │    │
│  │  - Scope chain                      │    │
│  │  - Siblings, imports                │    │
│  │  - Contextualized text generation   │    │
│  └────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

### Layer 2: REST API Microservice
```
┌─────────────────────────────────────────────┐
│      Express.js Microservice                 │
│      (Node.js/TypeScript)                    │
│                                              │
│  ┌────────────────────────────────────┐    │
│  │  HTTP Request Handler              │    │
│  │  - CORS, Helmet security           │    │
│  │  - JSON body parsing               │    │
│  │  - Request logging (Pino)          │    │
│  └────────────────────────────────────┘    │
│                    ↓                         │
│  ┌────────────────────────────────────┐    │
│  │  Input Validation Layer            │    │
│  │  - Zod schema validation           │    │
│  │  - Type safety                     │    │
│  │  - Error handling                  │    │
│  └────────────────────────────────────┘    │
│                    ↓                         │
│  ┌────────────────────────────────────┐    │
│  │  API Endpoints                     │    │
│  │  POST /chunk                       │    │
│  │  POST /chunk/batch                 │    │
│  │  POST /detect-language             │    │
│  │  GET  /health                      │    │
│  └────────────────────────────────────┘    │
│                    ↓                         │
│  ┌────────────────────────────────────┐    │
│  │  Response Formatting               │    │
│  │  - Consistent JSON structure       │    │
│  │  - Error normalization             │    │
│  └────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

### Layer 3: Python Client Library
```
┌─────────────────────────────────────────────┐
│      CodeChunkerClient                       │
│      (Python)                                │
│                                              │
│  ┌────────────────────────────────────┐    │
│  │  HTTP Client (requests)            │    │
│  │  - Connection pooling              │    │
│  │  - Timeout handling                │    │
│  │  - Retry logic                     │    │
│  └────────────────────────────────────┘    │
│                    ↓                         │
│  ┌────────────────────────────────────┐    │
│  │  Type-Safe Models                  │    │
│  │  - @dataclass models               │    │
│  │  - Type hints                      │    │
│  │  - Enum definitions                │    │
│  └────────────────────────────────────┘    │
│                    ↓                         │
│  ┌────────────────────────────────────┐    │
│  │  Public API Methods                │    │
│  │  - chunk()                         │    │
│  │  - chunk_batch()                   │    │
│  │  - detect_language()               │    │
│  │  - health_check()                  │    │
│  └────────────────────────────────────┘    │
│                    ↓                         │
│  ┌────────────────────────────────────┐    │
│  │  Error Handling                    │    │
│  │  - Custom exceptions               │    │
│  │  - Graceful degradation            │    │
│  └────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

### Layer 4: AI Agent Application
```
┌─────────────────────────────────────────────┐
│      CodeAnalysisAgent                       │
│      (Python)                                │
│                                              │
│  ┌────────────────────────────────────┐    │
│  │  Code Indexing                     │    │
│  │  - Batch file processing           │    │
│  │  - Language statistics             │    │
│  │  - Progress tracking               │    │
│  └────────────────────────────────────┘    │
│                    ↓                         │
│  ┌────────────────────────────────────┐    │
│  │  Embedding Generation              │    │
│  │  - Use contextualized text         │    │
│  │  - Vector embeddings               │    │
│  │  - Metadata attachment             │    │
│  └────────────────────────────────────┘    │
│                    ↓                         │
│  ┌────────────────────────────────────┐    │
│  │  Vector Database Storage           │    │
│  │  - Pinecone, Weaviate, etc.        │    │
│  │  - Chunk metadata                  │    │
│  │  - Search indices                  │    │
│  └────────────────────────────────────┘    │
│                    ↓                         │
│  ┌────────────────────────────────────┐    │
│  │  Semantic Search                   │    │
│  │  - Query embedding                 │    │
│  │  - Similarity search               │    │
│  │  - Result ranking                  │    │
│  └────────────────────────────────────┘    │
│                    ↓                         │
│  ┌────────────────────────────────────┐    │
│  │  LLM Integration                   │    │
│  │  - Context retrieval (RAG)         │    │
│  │  - Prompt construction             │    │
│  │  - Response generation             │    │
│  └────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

## 🔄 Data Flow

### Single File Chunking Flow
```
AI Agent                Client              Microservice            Library
    │                      │                      │                    │
    │  1. analyze_file()   │                      │                    │
    ├─────────────────────>│                      │                    │
    │                      │  2. POST /chunk      │                    │
    │                      ├─────────────────────>│                    │
    │                      │                      │  3. chunk()        │
    │                      │                      ├───────────────────>│
    │                      │                      │                    │
    │                      │                      │  4. Parse AST      │
    │                      │                      │  5. Extract entities│
    │                      │                      │  6. Build scope    │
    │                      │                      │  7. Chunk code     │
    │                      │                      │  8. Add context    │
    │                      │                      │<───────────────────┤
    │                      │  9. JSON response    │                    │
    │                      │<─────────────────────┤                    │
    │  10. CodeChunk[]     │                      │                    │
    │<─────────────────────┤                      │                    │
    │                      │                      │                    │
    │  11. Generate embeddings                    │                    │
    │  12. Store in vector DB                     │                    │
    │                      │                      │                    │
```

### Batch Processing Flow
```
AI Agent                Client              Microservice            Library
    │                      │                      │                    │
    │  1. index_codebase() │                      │                    │
    ├─────────────────────>│                      │                    │
    │   (100 files)        │                      │                    │
    │                      │  2. POST /batch      │                    │
    │                      ├─────────────────────>│                    │
    │                      │   (100 files)        │                    │
    │                      │                      │  3. chunkBatch()   │
    │                      │                      ├───────────────────>│
    │                      │                      │                    │
    │                      │                      │  4. Process with   │
    │                      │                      │     concurrency=10 │
    │                      │                      │                    │
    │                      │                      │  [Parallel Processing]
    │                      │                      │  chunk file 1      │
    │                      │                      │  chunk file 2      │
    │                      │                      │  ...               │
    │                      │                      │  chunk file 10     │
    │                      │                      │                    │
    │                      │                      │  5. Aggregate      │
    │                      │                      │     results        │
    │                      │                      │<───────────────────┤
    │                      │  6. Batch response   │                    │
    │                      │<─────────────────────┤                    │
    │                      │   (success + errors) │                    │
    │  7. BatchResult      │                      │                    │
    │<─────────────────────┤                      │                    │
    │                      │                      │                    │
    │  8. Process results  │                      │                    │
    │  9. Index in vector DB                      │                    │
    │                      │                      │                    │
```

## 🔐 Security Architecture

### Security Layers

1. **Network Layer**
   - HTTPS/TLS encryption (in production)
   - Firewall rules
   - VPC/network isolation

2. **Application Layer**
   ```typescript
   // Helmet.js security headers
   app.use(helmet({
     contentSecurityPolicy: true,
     crossOriginEmbedderPolicy: true,
     crossOriginOpenerPolicy: true,
     crossOriginResourcePolicy: true,
     dnsPrefetchControl: true,
     frameguard: true,
     hidePoweredBy: true,
     hsts: true,
     ieNoOpen: true,
     noSniff: true,
     originAgentCluster: true,
     permittedCrossDomainPolicies: true,
     referrerPolicy: true,
     xssFilter: true,
   }));
   ```

3. **Input Validation**
   ```typescript
   // Zod schemas validate all inputs
   const ChunkRequestSchema = z.object({
     filepath: z.string(),
     code: z.string(),
     options: z.object({...})
   });
   ```

4. **Resource Limits**
   ```typescript
   // Prevent DoS
   app.use(express.json({ limit: '50mb' }));
   
   // Docker resource limits
   deploy:
     resources:
       limits:
         cpus: '2'
         memory: 2G
   ```

## 📊 Scalability Architecture

### Horizontal Scaling

```
                    ┌──────────────────┐
                    │   Load Balancer  │
                    │   (nginx/ALB)    │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
    ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
    │ Chunker     │  │ Chunker     │  │ Chunker     │
    │ Instance 1  │  │ Instance 2  │  │ Instance 3  │
    └─────────────┘  └─────────────┘  └─────────────┘
```

### Deployment Options

1. **Docker Compose** (Simple)
   ```bash
   docker-compose up -d --scale code-chunker=5
   ```

2. **Kubernetes** (Production)
   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: code-chunker
   spec:
     replicas: 10
     template:
       spec:
         containers:
         - name: code-chunker
           image: code-chunker:latest
           resources:
             requests:
               memory: "512Mi"
               cpu: "500m"
             limits:
               memory: "2Gi"
               cpu: "2"
   ```

3. **Serverless** (Cloud Functions)
   - AWS Lambda + API Gateway
   - Google Cloud Functions
   - Azure Functions

### Caching Strategy

```
┌─────────────────────────────────────────────┐
│             AI Agent                         │
│                                              │
│  ┌────────────────────────────────────┐    │
│  │  Application Cache Layer           │    │
│  │  (Redis/Memcached)                 │    │
│  │                                     │    │
│  │  Key: hash(code)                   │    │
│  │  Value: chunks[]                   │    │
│  │  TTL: 1 hour                       │    │
│  └────────────────────────────────────┘    │
│                    ↓                         │
│         Cache miss? Call microservice       │
│                    ↓                         │
│  ┌────────────────────────────────────┐    │
│  │  CodeChunkerClient                 │    │
│  └────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

## 🎯 Why This Architecture Works

### 1. **Language Independence**
- TypeScript library runs in its native environment
- Python AI agent runs in its native environment
- Communication via universal HTTP/JSON protocol

### 2. **Scalability**
- Microservice can be scaled independently
- Batch processing with controlled concurrency
- Horizontal scaling with load balancers

### 3. **Maintainability**
- Clear separation of concerns
- Independent deployment cycles
- Isolated testing and debugging

### 4. **Reliability**
- Stateless service (easy to restart/replace)
- Health checks and monitoring
- Graceful error handling

### 5. **Performance**
- Connection pooling in Python client
- Batch processing for multiple files
- Optional caching layer

### 6. **Production-Ready**
- Docker containerization
- Structured logging
- Security best practices
- Resource limits and monitoring

## 📈 Performance Considerations

### Optimization Strategies

1. **Batch Processing**
   - Process many files in one request
   - Controlled concurrency (default: 10)
   - Reduces HTTP overhead

2. **Connection Pooling**
   ```python
   # Python client uses requests.Session
   self.session = requests.Session()
   # Reuses TCP connections
   ```

3. **Chunking Options**
   ```python
   ChunkOptions(
       max_chunk_size=1000,  # Smaller = more chunks
       max_siblings=3,        # Less context = faster
       include_imports=True   # More context = slower
   )
   ```

4. **Caching**
   - Cache frequently analyzed files
   - Use content hash as cache key
   - Invalidate on code changes

5. **Resource Limits**
   - Set appropriate Docker memory/CPU limits
   - Monitor and adjust based on usage
   - Use auto-scaling in production

## 🔍 Monitoring & Observability

### Logging Architecture

```
┌─────────────────────────────────────────────┐
│         Microservice Logs                    │
│         (Pino structured logging)            │
│                                              │
│  { level: "info",                           │
│    timestamp: "2024-01-01T00:00:00.000Z",   │
│    filepath: "app.py",                      │
│    codeLength: 1234,                        │
│    msg: "Chunking file" }                   │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
         ┌────────────────────┐
         │  Log Aggregation   │
         │  (ELK, Datadog,    │
         │   CloudWatch)      │
         └────────────────────┘
```

### Health Checks

```
┌─────────────────────────────────────────────┐
│  GET /health                                 │
│                                              │
│  - Service status                           │
│  - Timestamp                                │
│  - Version info                             │
│  - Dependencies status                      │
└─────────────────────────────────────────────┘
```

### Metrics to Track

- Request rate (requests/sec)
- Response time (avg, p95, p99)
- Error rate (errors/sec)
- Chunk count distribution
- Memory usage
- CPU usage
- Active connections

## 🎓 Best Practices

1. **Always use batch processing for multiple files**
2. **Cache frequently chunked files**
3. **Use contextualized_text for embeddings**
4. **Monitor service health in production**
5. **Set appropriate timeout values**
6. **Handle errors gracefully**
7. **Use connection pooling**
8. **Scale horizontally, not vertically**

## 📝 Summary

This architecture provides a **production-grade, scalable, maintainable** solution for integrating TypeScript code analysis with Python AI agents. It follows microservice best practices and can be deployed anywhere Docker runs.

The key insight: **Don't try to force TypeScript into Python. Run it as a service and communicate via HTTP.**
