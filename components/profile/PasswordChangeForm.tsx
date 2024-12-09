"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, RefreshCw, Check, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
const PasswordChangeForm = () => {
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const criteria = [
    { label: "At least 8 characters", test: (p) => p.length >= 8 },
    { label: "Contains numbers", test: (p) => /\d/.test(p) },
    { label: "Contains lowercase letters", test: (p) => /[a-z]/.test(p) },
    { label: "Contains uppercase letters", test: (p) => /[A-Z]/.test(p) },
    {
      label: "Contains special characters",
      test: (p) => /[^A-Za-z0-9]/.test(p),
    },
  ];

  const calculateStrength = (password: string) => {
    const passedCriteria = criteria.filter((c) => c.test(password));
    return (passedCriteria.length / criteria.length) * 100;
  };

  const getStrengthColor = (strength: number) => {
    if (strength < 40) return "bg-red-500";
    if (strength < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const generatePassword = () => {
    const length = 16;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setNewPassword(password);
  };

  const handleSubmit = async (e:  React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });

      if (!response.ok) {
        throw new Error("Failed to update password");
      }

      setSuccess(true);
      setNewPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const strength = calculateStrength(newPassword);

  return (
    <Card className="w-full max-w-md">
      <CardContent className="pt-6">
        <form onSubmit={(e)=>handleSubmit(e)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">New Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pr-24"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={generatePassword}
                      >
                        <RefreshCw size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Generate Password</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Password Strength</span>
              <span>{Math.round(strength)}%</span>
            </div>
            <Progress
              value={strength}
              className={`h-2 ${getStrengthColor(strength)}`}
            />
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium">Requirements:</span>
            <ul className="space-y-1">
              {criteria.map((criterion, index) => (
                <li key={index} className="text-sm flex items-center gap-2">
                  {criterion.test(newPassword) ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                  {criterion.label}
                </li>
              ))}
            </ul>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          {success && (
            <p className="text-sm text-green-500">
              Password updated successfully!
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading || strength < 70}
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PasswordChangeForm;
