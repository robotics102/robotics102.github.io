#include <queue>
#include <stack>
#include <vector>
#include <string>
#include <fstream>
#include <iostream>
#include <algorithm>

#define HIGH 1e6

/**
 * TODO: Define any structs you might need here.
 */

struct Graph
{
    std::vector<std::string> data;
    std::vector<std::vector<int> > edges;
    std::vector<std::vector<float> > edge_costs;

    // TODO: Add any members you need to the graph.
};

/**
 * Function definitions.
 */
int nameToIdx(std::string name, std::vector<std::string>& v);
Graph createGraph(std::string file_path);
std::vector<int> tracePath(int n, Graph& g);
void printPath(std::vector<int>& path, Graph& g);
std::vector<int> getNeighbors(int n, Graph& g);
std::vector<float> getEdgeCosts(int n, Graph& g);
int getParent(int n, Graph& g);
void initGraph(Graph& g);
std::vector<int> bfs(int start, int goal, Graph& g);

/**
 * Function implementations.
 */

int nameToIdx(std::string name, std::vector<std::string>& v)
{
    for (int i = 0; i < v.size(); i++)
    {
        if (v[i] == name) return i;
    }
    return -1;
}

Graph createGraph(std::string file_path)
{
    Graph g;
    std::ifstream in(file_path);
    if (!in.is_open())
    {
        std::cerr << "ERROR: Failed to load graph from " << file_path << std::endl;
        return g;
    }

    std::string s = "";
    int N = 0;
    while (s != "NODES") in >> s >> N;

    for (int i = 0; i < N; i++)
    {
        in >> s;
        g.data.push_back(s);
    }

    g.edges = std::vector<std::vector<int> >(N, std::vector<int>());
    g.edge_costs = std::vector<std::vector<float> >(N, std::vector<float>());

    while (s != "EDGES") in >> s >> N;

    std::string city1, city2;
    float dist;
    for (int i = 0; i < N; i++)
    {
        in >> city1 >> city2 >> dist;
        int c1 = nameToIdx(city1, g.data);
        int c2 = nameToIdx(city2, g.data);
        g.edges[c1].push_back(c2);
        g.edges[c2].push_back(c1);
        g.edge_costs[c1].push_back(dist);
        g.edge_costs[c2].push_back(dist);
    }

    return g;
}

std::vector<int> tracePath(int n, Graph& g)
{
    std::vector<int> path;
    int curr = n;
    do {
        path.push_back(curr);
        curr = getParent(curr, g);
    } while (curr != -1);

    // Since we built the path backwards, we need to reverse it.
    std::reverse(path.begin(), path.end());
    return path;
}

void printPath(std::vector<int>& path, Graph& g)
{
    if (path.size() < 1)
    {
        std::cout << "No path found :(\n";
        return;
    }

    std::cout << "Path: ";
    for (int i = 0; i < path.size() - 1; i++)
    {
        std::cout << g.data[path[i]] << " -> ";
    }
    std::cout <<  g.data[path.back()] << "\n";
}

std::vector<int> getNeighbors(int n, Graph& g)
{
    return g.edges[n];
}

std::vector<float> getEdgeCosts(int n, Graph& g)
{
    return g.edge_costs[n];
}

int getParent(int idx, Graph& g)
{
    // TODO: This function should return the index of the parent of the node at idx. 
    // If the node has no parent, return -1. 
    return -1;
}

void initGraph(Graph& g)
{
    // TODO: Initialize any data you need for graph search.
}

std::vector<int> bfs(int start, int goal, Graph& g)
{
    initGraph(g);
    std::vector<int> path;  // Put your final path here.

    std::queue<int> visit_list;

    // TODO: Perform Breadth First Search over the graph g.

    return path;
}

int main() {
    Graph g = createGraph("mi_graph.txt");

    int start = nameToIdx("ann_arbor", g.data);
    int goal = nameToIdx("marquette", g.data);

    std::cout << "Searching for a path from " << g.data[start];
    std::cout << " (index: " << start << ") to " << g.data[goal];
    std::cout << " (index: " << goal << ")...\n";

    std::vector<int> path = bfs(start, goal, g);
    printPath(path, g);

    return 0;
} 