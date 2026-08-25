const express = require("express");
const app = express();

// ============================================================================
// MIDDLEWARE CORNER CASES - Complete Reference Guide
// ============================================================================

// ============================================================================
// CORNER CASE 1: Calling next() but also calling res.send()
// ============================================================================
// ❌ PROBLEM: Code after res.send() still executes (but response already sent)
// This causes: "Error: Cannot set headers after they are sent to the client"

app.use("/case1", (req, res, next)=>{
    console.log("Case 1: First middleware");
    next();  // ✅ Pass control to next middleware
    res.send({data: "first"});  // ⚠️ This will cause error because second middleware already sent response
}, (req, res, next)=>{
    console.log("Case 1: Second middleware");
    res.send("Second response");  // ✅ Response sent here (first one)
});

// Expected Output:
// Case 1: First middleware
// Case 1: Second middleware
// ERROR: Cannot set headers after they are sent


// ============================================================================
// CORNER CASE 2: Not calling next() - Chain breaks
// ============================================================================
// ❌ PROBLEM: Middleware after res.send() never executes if no next() called

app.use("/case2", 
    (req, res, next)=>{
        console.log("Case 2: First middleware");
        res.send("Response from first");  // ❌ No next() called, chain stops
        // Second middleware NEVER runs
    }, 
    (req, res, next)=>{
        console.log("Case 2: Second middleware");  // ❌ NEVER PRINTS
        res.send("Second");
    },
    (req, res, next)=>{
        console.log("Case 2: Third middleware");   // ❌ NEVER PRINTS
        res.send("Third");
    }
);

// Expected Output:
// Case 2: First middleware
// Response sent: "Response from first"
// (Second and Third middleware never execute)


// ============================================================================
// CORNER CASE 3: Proper chain - all call next() except last
// ============================================================================
// ✅ CORRECT PATTERN: Each middleware calls next() until last one sends response

app.use("/case3", 
    // Middleware 1 - just logging
    (req, res, next)=>{
        console.log("Case 3: First middleware - logging");
        next();  // ✅ Pass to next
    }, 
    // Middleware 2 - authentication check
    (req, res, next)=>{
        console.log("Case 3: Second middleware - auth check");
        // Do some auth logic
        next();  // ✅ Pass to next
    },
    // Middleware 3 - data processing
    (req, res, next)=>{
        console.log("Case 3: Third middleware - data processing");
        // Do some processing
        next();  // ✅ Pass to next
    },
    // Middleware 4 - send final response
    (req, res)=>{
        console.log("Case 3: Fourth middleware - send response");
        res.send({status: "success", data: "Final response"});  // ✅ Send response
    }
);

// Expected Output:
// Case 3: First middleware - logging
// Case 3: Second middleware - auth check
// Case 3: Third middleware - data processing
// Case 3: Fourth middleware - send response
// Response: {status: "success", data: "Final response"}


// ============================================================================
// CORNER CASE 4: Missing 'next' parameter - can't call next()
// ============================================================================
// ❌ PROBLEM: If middleware doesn't have 'next' parameter, chain breaks

app.use("/case4", 
    (req, res)=>{  // ❌ No 'next' parameter
        console.log("Case 4: First middleware");
        // next();  // ❌ Can't call this - next is undefined
        res.send("First response");
    }, 
    (req, res, next)=>{
        console.log("Case 4: Second middleware");  // ❌ NEVER RUNS (no next() called in first)
        res.send("Second response");
    }
);

// Expected Output:
// Case 4: First middleware
// Response sent: "First response"
// (Second middleware never executes)


// ============================================================================
// CORNER CASE 5: next() called but no more middleware in chain
// ============================================================================
// ⚠️ WARNING: next() called at end of chain (response not sent)
// Browser hangs waiting for response

app.use("/case5", 
    (req, res, next)=>{
        console.log("Case 5: First middleware");
        next();  // ✅ But there's no next middleware to handle it!
        // And no res.send() called
    }
);

// Expected Output:
// Case 5: First middleware
// Browser: Hangs/Loading... (never responds)
// ⚠️ FIX: Either add more middleware or call res.send()


// ============================================================================
// CORNER CASE 6: res.send() called BEFORE next()
// ============================================================================
// ❌ PROBLEM: Code after res.send() still executes but response already sent

app.use("/case6", 
    (req, res, next)=>{
        console.log("Case 6: First middleware");
        res.send("First response");  // ✅ Response sent
        next();  // ⚠️ This still gets called (but response already sent)
    }, 
    (req, res, next)=>{
        console.log("Case 6: Second middleware");  // ❌ Still gets called!
        // But can't send response - already sent
    }
);

// Expected Output:
// Case 6: First middleware
// Case 6: Second middleware (still runs!)
// ERROR: Cannot set headers after they are sent


// ============================================================================
// CORNER CASE 7: Multiple res.send() calls
// ============================================================================
// ❌ PROBLEM: Only first res.send() actually sends to client
// All others cause error

app.use("/case7", 
    (req, res)=>{
        console.log("Case 7: First middleware");
        res.send("First response");  // ✅ This goes to client
        res.send("Second response");  // ❌ ERROR: Cannot set headers after they are sent
        res.send("Third response");   // ❌ ERROR: Cannot set headers after they are sent
    }
);

// Expected Output:
// Case 7: First middleware
// Response sent: "First response"
// ERROR: Cannot set headers after they are sent


// ============================================================================
// CORNER CASE 8: Using next() for error handling
// ============================================================================
// ✅ GOOD: Pass errors to next middleware for handling

app.use("/case8", 
    (req, res, next)=>{
        console.log("Case 8: First middleware");
        try {
            throw new Error("Something went wrong!");
        } catch(err) {
            next(err);  // ✅ Pass error to next middleware
        }
    },
    // Error handling middleware (4 parameters)
    (err, req, res, next)=>{
        console.log("Case 8: Error handler");
        console.log("Error:", err.message);
        res.status(500).send("Error: " + err.message);
    }
);

// Expected Output:
// Case 8: First middleware
// Case 8: Error handler
// Error: Something went wrong!
// Response: Error: Something went wrong!


// ============================================================================
// CORNER CASE 9: Middleware without res.send() and no next()
// ============================================================================
// ❌ PROBLEM: Browser waits forever for response

app.use("/case9", 
    (req, res, next)=>{
        console.log("Case 9: Middleware executes");
        // ❌ Neither res.send() nor next() called!
    }
);

// Expected Output:
// Case 9: Middleware executes
// Browser: Hangs/Loading... forever


// ============================================================================
// CORNER CASE 10: Response methods available in middleware
// ============================================================================
// ✅ Different ways to send responses

app.use("/case10a", (req, res)=>{
    res.send("Plain text response");  // Send text/html
});

app.use("/case10b", (req, res)=>{
    res.json({key: "value"});  // Send JSON
});

app.use("/case10c", (req, res)=>{
    res.status(404).send("Not found");  // With status code
});

app.use("/case10d", (req, res)=>{
    res.redirect("/other-url");  // Redirect
});

app.use("/case10e", (req, res)=>{
    res.download("file.pdf");  // Download file
});


// ============================================================================
// CORNER CASE 11: Accessing request in middleware
// ============================================================================
// ✅ Use req to access request data

app.use("/case11", (req, res, next)=>{
    console.log("Case 11: Request details");
    console.log("Method:", req.method);           // GET, POST, etc.
    console.log("URL:", req.url);                 // /case11?param=value
    console.log("Path:", req.path);               // /case11
    console.log("Query:", req.query);             // {param: "value"}
    console.log("Headers:", req.headers);         // All headers
    console.log("IP:", req.ip);                   // Client IP
    
    res.send("Logged request details");
    next();
});


// ============================================================================
// CORNER CASE 12: Multiple middleware at same path (execution order)
// ============================================================================
// ✅ CORRECT: Middleware executes in order they are defined

app.use("/case12",
    (req, res, next)=>{
        console.log("Case 12: First (executes first)");
        next();
    },
    (req, res, next)=>{
        console.log("Case 12: Second (executes second)");
        next();
    },
    (req, res, next)=>{
        console.log("Case 12: Third (executes third)");
        res.send("Response from third");
    }
);

// Expected Output (IN THIS ORDER):
// Case 12: First (executes first)
// Case 12: Second (executes second)
// Case 12: Third (executes third)
// Response: "Response from third"


// ============================================================================
// BEST PRACTICES SUMMARY
// ============================================================================
/*
1. ✅ Always call next() if you want to pass control to next middleware
2. ✅ Always call res.send() (or similar) when you want to send response
3. ✅ Only ONE res.send() should be called per request
4. ✅ Error handlers need 4 parameters: (err, req, res, next)
5. ✅ Middleware executes in order they are defined
6. ❌ Don't forget 'next' parameter if you need to call next()
7. ❌ Don't call res.send() multiple times
8. ❌ Don't forget to call either next() or res.send()
9. ✅ Use next() for middleware, res.send() for final response
*/

app.listen(3000, ()=>console.log("Server running on port 3000"));
