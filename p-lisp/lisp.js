// File: lisp.js
//                        
// Author: Paul M. Parks
// 
// Purpose: 
// An implementation of Lisp in JavaScript.
// 
// Comments: 
//
// Greenspun's Tenth Rule of Programming: "Any sufficiently complicated
// C or Fortran program contains an ad-hoc, informally-specified
// bug-ridden slow implementation of half of Common Lisp."
//
// I suppose we can add JavaScript to that list, now.
// 
// Contact:
// 
// paul@parkscomputing.com
// http://www.parkscomputing.com/
// 
// License:
// 
// Copyright (c) 2005, Paul M. Parks
// All Rights Reserved.
// 
// Redistribution and use in source and binary forms, with or without 
// modification, are permitted provided that the following conditions 
// are met:
// 
// * Redistributions of source code must retain the above copyright 
//   notice, this list of conditions and the following disclaimer.
// 
// * Redistributions in binary form must reproduce the above 
//   copyright notice, this list of conditions and the following 
//   disclaimer in the documentation and/or other materials provided 
//   with the distribution.
// 
// * Neither the name of Paul M. Parks nor the names of his 
//   contributors may be used to endorse or promote products derived 
//   from this software without specific prior written permission.
// 
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS 
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT 
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS 
// FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE 
// COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, 
// INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, 
// BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; 
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER 
// CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT 
// LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN 
// ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF 
// THE POSSIBILITY OF SUCH DAMAGE.
//


var Lisp = new Object();


Lisp.showSource = function() {};
Lisp.debug = function(str) {};
Lisp.oneval = function(value) {};


Lisp.functions = new Object();

this["apropos"] = new function()
{
};

this["apropos"].__documentation = "Display a list of symbols that are a partial match to the provided string.";


this["apropos"].entries = new Object();


this["t"] = this["T"] = true;

// Oh, my, what a horrible attempt at case-insensivity. Shoot me.
this["nil"] = this["Nil"] = this["nIl"] = this["NIl"] =
this["niL"] = this["NiL"] = this["nIL"] = this["NIL"] = new Array();

// Sorry, functions are all-caps. I'm not committing the above
// crime for everything. The evaluation engine will convert to
// all-caps before calling the functions.
this["eq"] = this["="] = function()
{
   return (arguments[0] == arguments[1]) ? T : NIL;
};

this["eq"].__documentation = "Return T if parameters are equal, NIL otherwise.";


this["null"] = function(param)
{
   return (param.length != undefined && param.length == 0);
};

this["null"].__documentation = "Return T if the parameter is NIL, or ()";


this["symbolp"] = function(param)
{
   var ret = this[param];
   var context = this;
   
   while (ret == undefined && context.parent && context.parent !== this)
   {
      context = context.parent;
      ret = context[param];
   }
   
   return ret != undefined ? T : NIL;
};


this["not"] = function()
{
   return (arguments[0] == NIL || arguments[0].length != undefined && arguments[0].length == 0) ? T : NIL;
};

this["not"].__documentation = "Return the negation of the parameter.";


this["cond"] = function()
{
   var ret = NIL;
   
   for (var i = 0; i < arguments.length; ++i)
   {
      var ix = 0;
      var cond = arguments[i][ix];
      
      if (typeof cond == "object" && cond.length)
      {
         cond = Lisp.eval.call(this, cond);
      }
      else
      {
         if (cond == "'")
         {
            ++ix;
            cond = arguments[i][ix];
         }
         else
         {
            cond = Lisp.eval.call(this, cond);
         }
      }

      if (cond != NIL)
      {
         var ret = cond;
         
         ++ix;

         while (ix < arguments[i].length)
         {
            ret = arguments[i][ix];
            
            if (typeof ret == "object" && ret.length)
            {
               ret = Lisp.eval.call(this, ret);
            }
            else if (typeof ret == "string")
            {
               if (ret == "'")
               {
                  ++ix;
                  ret = arguments[i][ix];
               }
               else
               {
                  ret = Lisp.eval.call(this, ret);
               }
            }
            
            ++ix;
         }

         return ret;
      }
   }

   return NIL;
};


this["and"] = function()
{
   for (var i = 0; i < arguments.length; ++i)
   {
      var cond = arguments[i];
      
      if (typeof cond == "object" && cond.length)
      {
         cond = Lisp.eval.call(this, cond);
      }
      else 
      {
         if (cond == "'")
         {
            ++i;
            cond = arguments[i];
         }
         else
         {
            cond = Lisp.eval.call(this, cond);
         }
      }

      if (Lisp.global["not"].call(this, cond) != NIL)
      {
         return cond;
      }
   }

   return cond;
};

this["if"] = this["cond"];
this["or"] = function()
{
   var ret = NIL;

   for (var i = 0; i < arguments.length; ++i)
   {
      var cond = arguments[i];
      
      if (typeof cond == "object" && cond.length)
      {
         cond = Lisp.eval.call(this, cond);
      }
      else
      {
         if (cond == "'")
         {
            ++i;
            cond = arguments[i];
         }
         else
         {
            cond = Lisp.eval.call(this, cond);
         }
      }

      if (cond != NIL)
      {
         return cond;
      }
   }

   return NIL;
};


this[">"] = function()
{
   return (arguments[0] > arguments[1]) ? T : NIL;
};


this["