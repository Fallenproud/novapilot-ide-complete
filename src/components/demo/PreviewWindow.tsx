
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, User, Plus } from "lucide-react";

interface PreviewWindowProps {
  mode: 'chat' | 'build';
}

const PreviewWindow = ({ mode }: PreviewWindowProps) => {
  return (
    <div className="h-[calc(100%-60px)] bg-gray-50 dark:bg-gray-900 p-6 overflow-auto">
      {mode === 'chat' ? (
        <div className="space-y-6">
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Advisory Mode</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              In advisory mode, I provide guidance, answer questions, and help with code analysis without making changes to your project.
            </p>
          </div>
          
          <Card className="p-6">
            <h4 className="font-medium mb-3">Sample Code Analysis</h4>
            <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
              <code>{`function TaskCard({ task, onComplete }) {
  return (
    <div className="p-4 border rounded-lg">
      <h3>{task.title}</h3>
      <button onClick={() => onComplete(task.id)}>
        Complete
      </button>
    </div>
  );
}`}</code>
            </pre>
            <div className="mt-3 text-sm text-muted-foreground">
              <p>✅ Good: Clean component structure</p>
              <p>⚠️ Suggestion: Add TypeScript interfaces</p>
              <p>💡 Enhancement: Consider accessibility attributes</p>
            </div>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Task Management App Preview */}
          <div className="bg-white dark:bg-card rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Task Manager</h1>
                <p className="text-muted-foreground">Organize your work efficiently</p>
              </div>
              <Button className="bg-gradient-to-r from-purple-500 to-blue-600">
                <Plus className="mr-2 h-4 w-4" />
                New Task
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {/* To Do */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-gray-400" />
                  <h3 className="font-medium">To Do</h3>
                  <Badge variant="secondary">3</Badge>
                </div>
                <div className="space-y-2">
                  <TaskCard
                    title="Design user interface"
                    assignee="Sarah"
                    status="todo"
                  />
                  <TaskCard
                    title="Set up authentication"
                    assignee="Mike"
                    status="todo"
                  />
                  <TaskCard
                    title="Create database schema"
                    assignee="Alex"
                    status="todo"
                  />
                </div>
              </div>

              {/* In Progress */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <h3 className="font-medium">In Progress</h3>
                  <Badge variant="secondary">2</Badge>
                </div>
                <div className="space-y-2">
                  <TaskCard
                    title="Implement drag and drop"
                    assignee="Jordan"
                    status="progress"
                  />
                  <TaskCard
                    title="Add real-time updates"
                    assignee="Sam"
                    status="progress"
                  />
                </div>
              </div>

              {/* Done */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <h3 className="font-medium">Done</h3>
                  <Badge variant="secondary">4</Badge>
                </div>
                <div className="space-y-2">
                  <TaskCard
                    title="Project setup"
                    assignee="Chris"
                    status="done"
                  />
                  <TaskCard
                    title="Component library"
                    assignee="Taylor"
                    status="done"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TaskCard = ({ title, assignee, status }: { title: string; assignee: string; status: string }) => {
  return (
    <Card className="p-3 cursor-pointer hover:shadow-md transition-shadow">
      <div className="space-y-2">
        <h4 className="font-medium text-sm">{title}</h4>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{assignee}</span>
          </div>
          {status === 'done' && (
            <CheckCircle className="h-4 w-4 text-green-500" />
          )}
        </div>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>Due today</span>
        </div>
      </div>
    </Card>
  );
};

export default PreviewWindow;
