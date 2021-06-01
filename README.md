# www.LiveSearch.pl
![livesearch](https://media.giphy.com/media/0dOgFAIPsNgBXMqwtx/giphy.gif)

Livesearch is a social media site which visualizes popular data in a nice user-friendly way. Users can collect data that interests them and share it with one another.

## Table of Contents

- Coding
  - [StyleCop](#stylecop)
  - [Unit Testing](#unit-testing)
- Documentation
  - [Ghost Doc](#ghost-doc)
  - [DocFx](#docfx)

# Coding

## StyleCop


### How to use it

* Install the [StyleCop.Analyzers](https://www.nuget.org/packages/StyleCop.Analyzers/) nuget in each project in your solution.
* Copy the file [StyleCop.Analyzers.ruleset](https://github.com/unosquare/best-practices/blob/master/C%23/StyleCop.Analyzers.ruleset) in the your solution's root folder.
* Reference the ruleset using the following XML node in each CSPROJ file:

```
<Project Sdk="Microsoft.NET.Sdk">
    <PropertyGroup>
        ...
        <CodeAnalysisRuleSet>..\..\StyleCop.Analyzers.ruleset</CodeAnalysisRuleSet>
    </PropertyGroup>
    ...
</Project>
```
