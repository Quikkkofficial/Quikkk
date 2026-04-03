import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin } from "lucide-react";
import { useListApplications } from "@workspace/api-client-react";

export default function Track() {
  const [appNumber, setAppNumber] = useState("");
  const [searched, setSearched] = useState(false);
  const { data, isLoading } = useListApplications({ search: appNumber }, { query: { enabled: searched && !!appNumber } });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (appNumber) {
      setSearched(true);
    }
  };

  const application = data?.applications?.[0];

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-2xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Track Your Application</h1>
        <p className="text-muted-foreground mt-2">Enter your application reference number to check its current status.</p>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <Input 
              placeholder="e.g. APP-123456" 
              value={appNumber} 
              onChange={(e) => {
                setAppNumber(e.target.value);
                setSearched(false);
              }} 
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              <Search className="h-4 w-4 mr-2" />
              Track
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading && searched && (
        <div className="flex justify-center p-8">
          <p className="text-muted-foreground">Searching...</p>
        </div>
      )}

      {searched && !isLoading && !application && (
        <Card className="bg-muted/50">
          <CardContent className="p-8 text-center text-muted-foreground">
            No application found with that number.
          </CardContent>
        </Card>
      )}

      {searched && !isLoading && application && (
        <Card>
          <CardHeader>
            <CardTitle>Application Details</CardTitle>
            <CardDescription>Reference: {application.applicationNumber}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Product Type</p>
                <p className="font-medium capitalize">{application.type.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <p className="font-medium capitalize">{application.status.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Amount</p>
                <p className="font-medium">{application.amount ? `₹${application.amount.toLocaleString()}` : '-'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Applied On</p>
                <p className="font-medium">{new Date(application.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-medium mb-4">Status Timeline</h3>
              <div className="relative pl-6 border-l-2 border-muted space-y-6">
                <div className="relative">
                  <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-primary border-4 border-background" />
                  <p className="font-medium">Current Status: {application.status.replace('_', ' ')}</p>
                  <p className="text-xs text-muted-foreground mt-1">Last updated: {new Date(application.updatedAt).toLocaleDateString()}</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-muted border-4 border-background" />
                  <p className="font-medium text-muted-foreground">Application Submitted</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(application.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}