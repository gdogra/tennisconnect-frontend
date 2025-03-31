import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { CalendarIcon, ClockIcon, XIcon, CheckIcon } from "lucide-react";

export default function ChallengeCard({ challenge, type }) {
  const opponent = type === "sent" ? challenge.receiver : challenge.sender;

  const name =
    opponent?.first_name && opponent?.last_name
      ? `${opponent.first_name} ${opponent.last_name}`
      : "Unknown Player";

  const avatarUrl = opponent?.avatar_url;
  const skillLevel = opponent?.skill_level ?? "N/A";

  const status = challenge?.status ?? "pending";
  const date = challenge?.proposed_date ? new Date(challenge.proposed_date) : null;

  const formatDate = date
    ? `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    : "Not scheduled";

  const relativeTime = date ? formatDistanceToNow(date, { addSuffix: true }) : null;

  const handleAccept = () => {
    console.log("Accept challenge:", challenge.id);
    // add real handler
  };

  const handleDecline = () => {
    console.log("Decline challenge:", challenge.id);
    // add real handler
  };

  const handleSchedule = () => {
    console.log("Schedule challenge:", challenge.id);
    // open modal or calendar
  };

  return (
    <div className="flex items-start gap-4 p-4 border rounded-xl shadow-sm bg-white">
      <Avatar>
        <AvatarImage src={avatarUrl} alt={name} />
        <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium text-gray-800">{name}</p>
            <p className="text-sm text-gray-500">Skill: {skillLevel}</p>
            {date && (
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <CalendarIcon className="w-4 h-4 mr-1" />
                <span>{formatDate}</span>
              </div>
            )}
            {relativeTime && (
              <div className="flex items-center text-xs text-gray-400 mt-0.5">
                <ClockIcon className="w-3 h-3 mr-1" />
                <span>{relativeTime}</span>
              </div>
            )}
          </div>
          <div>
            {type === "received" && status === "pending" && (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleDecline}>
                  <XIcon className="w-4 h-4 mr-1" />
                  Decline
                </Button>
                <Button size="sm" onClick={handleAccept}>
                  <CheckIcon className="w-4 h-4 mr-1" />
                  Accept
                </Button>
              </div>
            )}
            {status === "accepted" && (
              <Button size="sm" variant="secondary" onClick={handleSchedule}>
                <CalendarIcon className="w-4 h-4 mr-1" />
                Schedule Match
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
